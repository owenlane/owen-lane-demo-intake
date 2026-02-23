import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { logActivity } from '../lib/audit';
import { loginSchema, statusUpdateSchema } from '../validators/schemas';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// POST /api/admin/login — public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid credentials format' });
    }

    const { email, password } = parsed.data;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await logActivity(user.id, 'admin_login', { email: user.email });

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// All routes below require auth
router.use(authMiddleware);
router.use(requireRole('admin', 'staff'));

// GET /api/admin/submissions
router.get('/submissions', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      search,
      sort = 'created_at',
      order = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('intake_submissions')
      .select('*, patients!inner(*)', { count: 'exact' });

    if (status && ['new', 'reviewed', 'completed'].includes(status)) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
        { foreignTable: 'patients' }
      );
    }

    const validSorts = ['created_at', 'updated_at', 'status'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const ascending = order === 'asc';

    query = query
      .order(sortField, { ascending })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Submissions query error:', error);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    await logActivity(req.user!.userId, 'view_submissions_list', {
      page: pageNum,
      status,
      search,
    });

    return res.json({
      submissions: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error('List submissions error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/submissions/export/csv
router.get('/submissions/export/csv', async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query as Record<string, string>;

    let query = supabase
      .from('intake_submissions')
      .select('*, patients!inner(*)');

    if (status && ['new', 'reviewed', 'completed'].includes(status)) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
        { foreignTable: 'patients' }
      );
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('CSV export error:', error);
      return res.status(500).json({ error: 'Export failed' });
    }

    const rows = data || [];
    const csvHeader =
      'Submission ID,Status,First Name,Last Name,DOB,Phone,Email,City,State,Created At\n';
    const csvBody = rows
      .map((r: any) => {
        const p = r.patients;
        return [
          r.id,
          r.status,
          p.first_name,
          p.last_name,
          p.date_of_birth,
          p.phone,
          p.email,
          p.address_city,
          p.address_state,
          r.created_at,
        ]
          .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
          .join(',');
      })
      .join('\n');

    await logActivity(req.user!.userId, 'export_csv', { status, search, rowCount: rows.length });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
    return res.send(csvHeader + csvBody);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/submissions/:id
router.get('/submissions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('intake_submissions')
      .select('*, patients!inner(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await logActivity(req.user!.userId, 'view_submission', { submissionId: id });

    return res.json(data);
  } catch (err) {
    console.error('Get submission error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/submissions/:id/status
router.patch('/submissions/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = statusUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { status } = parsed.data;

    const { data, error } = await supabase
      .from('intake_submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await logActivity(req.user!.userId, 'update_status', {
      submissionId: id,
      newStatus: status,
    });

    return res.json({ message: 'Status updated', submission: data });
  } catch (err) {
    console.error('Status update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
