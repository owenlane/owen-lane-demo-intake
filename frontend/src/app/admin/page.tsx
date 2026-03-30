import Link from 'next/link';

const summaryCards = [
  {
    title: "Today's Appointments",
    value: '12',
    subtext: '3 in the next hour',
  },
  {
    title: 'Completed Today',
    value: '5',
    subtext: '2 marked complete recently',
  },
  {
    title: 'Pending Confirmations',
    value: '4',
    subtext: 'Needs attention now',
  },
  {
    title: 'Intake Missing',
    value: '3',
    subtext: 'Patients not ready yet',
  },
];

const urgentItems = [
  {
    name: 'Emily Carter',
    issue: 'Unconfirmed appointment',
    time: '9:30 AM',
    action: 'Review',
  },
  {
    name: 'Daniel Lopez',
    issue: 'Intake missing',
    time: '10:15 AM',
    action: 'Send Intake',
  },
  {
    name: 'Sophia Nguyen',
    issue: 'Booking request waiting',
    time: '11:00 AM',
    action: 'Open',
  },
  {
    name: 'Marcus Johnson',
    issue: 'Needs follow-up',
    time: '1:45 PM',
    action: 'Review',
  },
];

const waitingItems = [
  {
    label: 'Waiting / Upcoming Soon',
    count: '6',
    items: [
      'Emily Carter — 9:30 AM',
      'Daniel Lopez — 10:15 AM',
      'Sophia Nguyen — 11:00 AM',
    ],
  },
  {
    label: 'Unconfirmed',
    count: '4',
    items: [
      'Marcus Johnson — 1:45 PM',
      'Olivia Brown — 2:00 PM',
      'Noah Davis — 2:30 PM',
    ],
  },
  {
    label: 'Intake Missing',
    count: '3',
    items: [
      'Ava Wilson — 3:00 PM',
      'Liam Garcia — 3:30 PM',
      'Mia Thomas — 4:00 PM',
    ],
  },
];

const calendarPreview = [
  {
    time: '9:30 AM',
    patient: 'Emily Carter',
    provider: 'Dr. Smith',
    status: 'Pending',
    intake: 'Missing',
  },
  {
    time: '10:15 AM',
    patient: 'Daniel Lopez',
    provider: 'Dr. Smith',
    status: 'Confirmed',
    intake: 'Complete',
  },
  {
    time: '11:00 AM',
    patient: 'Sophia Nguyen',
    provider: 'Dr. Lee',
    status: 'Pending',
    intake: 'Pending',
  },
  {
    time: '1:45 PM',
    patient: 'Marcus Johnson',
    provider: 'Dr. Lee',
    status: 'Confirmed',
    intake: 'Missing',
  },
];

const quickLinks = [
  {
    title: 'Booking Requests',
    description: 'Review new appointment requests and route them fast.',
    href: '/admin/bookings',
    button: 'View Bookings',
  },
  {
    title: 'Intake Submissions',
    description: 'Review forms, missing data, and intake readiness.',
    href: '/admin/submissions',
    button: 'View Intake',
  },
  {
    title: 'Patients',
    description: 'Open patient records, history, and profile actions.',
    href: '/admin/patients',
    button: 'View Patients',
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Admin Home
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Command Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              What happened today, what needs attention now, and who is waiting.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Today
            </p>
            <p className="mt-1 text-lg font-semibold">March 29, 2026</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm text-slate-600">{card.subtext}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Urgent Attention</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The next items staff needs to handle right now.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {urgentItems.map((item) => (
                  <div
                    key={`${item.name}-${item.time}`}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-base font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.issue}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        {item.time}
                      </p>
                    </div>

                    <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {waitingItems.map((group) => (
                <div
                  key={group.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold leading-tight">{group.label}</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {group.count}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {group.items.map((entry) => (
                      <div
                        key={entry}
                        className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700"
                      >
                        {entry}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Calendar Preview</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Today’s live lineup at a glance.
                </p>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Today
              </button>
            </div>

            <div className="space-y-3">
              {calendarPreview.map((appt) => (
                <div
                  key={`${appt.time}-${appt.patient}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {appt.time}
                      </p>
                      <p className="mt-1 text-lg font-bold">{appt.patient}</p>
                      <p className="mt-1 text-sm text-slate-600">{appt.provider}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {appt.status}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Intake: {appt.intake}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-xl font-bold tracking-tight">{link.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{link.description}</p>

              <Link
                href={link.href}
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {link.button}
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}