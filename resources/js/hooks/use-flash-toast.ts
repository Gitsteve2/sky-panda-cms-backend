import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface SharedFlash {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
}

export function useFlashToast(): void {
    const lastMessageRef = useRef<string | null>(null);

    useEffect(() => {
        const handleFlashObject = (flash?: SharedFlash) => {
            if (!flash) return;

            const entries: Array<['success' | 'error' | 'warning' | 'info', string | null | undefined]> = [
                ['success', flash.success],
                ['error', flash.error],
                ['warning', flash.warning],
                ['info', flash.info],
            ];

            for (const [type, message] of entries) {
                if (message && message !== lastMessageRef.current) {
                    lastMessageRef.current = message;
                    toast[type](message);
                }
            }
        };

        const removeSuccess = router.on('success', (event) => {
            const flash = (event as CustomEvent).detail?.page?.props?.flash as SharedFlash | undefined;
            handleFlashObject(flash);
        });

        const removeFlash = router.on('flash', (event) => {
            const eventFlash = (event as CustomEvent).detail?.flash;
            const data = eventFlash?.toast as FlashToast | undefined;

            if (data) {
                toast[data.type](data.message);
            }
        });

        return () => {
            removeSuccess();
            removeFlash();
        };
    }, []);
}
