import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive' | 'warning';
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    const handleConfirm = (e: React.MouseEvent) => {
        e.preventDefault();
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="animate-in duration-200 fade-in-50 slide-in-from-bottom-4 sm:max-w-md">
                <DialogHeader className="flex flex-row items-start gap-4 space-y-0 text-left">
                    {variant === 'destructive' && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    )}
                    {variant === 'warning' && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    )}
                    <div className="space-y-1">
                        <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={
                            variant === 'destructive'
                                ? 'destructive'
                                : variant === 'warning'
                                  ? 'default'
                                  : 'default'
                        }
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="w-full min-w-[80px] sm:w-auto"
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
