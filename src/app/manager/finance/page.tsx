import {
  ManagerShell,
  StatCard,
  StatusBadge,
} from "~/components/dashboard/shell";
import { formatCurrency, formatDate } from "~/lib/format";
import { requireManagerSession } from "~/server/auth/guards";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function ManagerFinancePage() {
  await requireManagerSession();

  const [paidRevenue, paidPayments, unpaidPayments, failedPayments, payments, transactions] =
    await Promise.all([
      db.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      db.payment.count({ where: { status: "PAID" } }),
      db.payment.count({ where: { status: "UNPAID" } }),
      db.payment.count({ where: { status: "FAILED" } }),
      db.payment.findMany({
        include: {
          booking: {
            include: {
              guest: true,
              villa: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      db.transaction.findMany({
        include: {
          booking: {
            include: {
              guest: true,
              villa: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

  return (
    <ManagerShell
      title="Financial Overview"
      description="Track dummy payment status, paid revenue, and transaction records for the MVP finance workflow."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Paid revenue"
          value={formatCurrency(paidRevenue._sum.amount)}
          detail="Payment status PAID"
        />
        <StatCard label="Paid payments" value={paidPayments} detail="Settled" />
        <StatCard label="Unpaid payments" value={unpaidPayments} detail="Pending" />
        <StatCard label="Failed payments" value={failedPayments} detail="Needs review" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-stone-950">Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Villa</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-4 text-stone-700">
                      {payment.booking.guest.name}
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      {payment.booking.villa.name}
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">Transactions</h2>
          <div className="mt-5 grid gap-3">
            {transactions.map((transaction) => (
              <article
                className="rounded-md border border-stone-200 p-4"
                key={transaction.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-950">
                      {transaction.type.replaceAll("_", " ")}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {transaction.booking?.villa.name ?? "Adjustment"} -{" "}
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <StatusBadge value={transaction.status} />
                </div>
                <p className="mt-3 text-sm font-semibold text-stone-700">
                  {formatCurrency(transaction.amount)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}
