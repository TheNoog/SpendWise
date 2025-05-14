
import { WalletMinimal } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps extends SVGProps<SVGSVGElement> {
  showText?: boolean;
}

export function AppLogo({ showText = true, className, ...props }: AppLogoProps) {
  return (
    <div className="flex items-center gap-2 p-2">
      <WalletMinimal className={cn("h-8 w-8 text-sidebar-primary", className)} {...props} />
      {showText && <h1 className="text-xl font-semibold text-sidebar-foreground">SpendWise</h1>}
    </div>
  );
}

