
import { PredictionForm } from '@/components/predictions/PredictionForm';

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Spending Predictions</h1>
      <PredictionForm />
    </div>
  );
}
