
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionForm } from '@/components/transactions/TransactionForm';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
        <TransactionForm />
      </div>
      <TransactionTable />
    </div>
  );
}
