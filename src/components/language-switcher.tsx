
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
    const t = useTranslations('LanguageSwitcher');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();

    const changeLocale = (newLocale: string) => {
        // This regex removes the current locale from the start of the pathname
        const newPathname = pathname.replace(/^\/(en|ru)/, '');
        router.replace(`/${newLocale}${newPathname}?${searchParams.toString()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLocale('en')} disabled={locale === 'en'}>
                    {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('ru')} disabled={locale === 'ru'}>
                    {t('russian')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
