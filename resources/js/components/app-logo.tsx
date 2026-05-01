import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-15 items-center justify-center rounded-md  text-sidebar-primary-foreground">
                <AppLogoIcon className="size-15 fill-current text-white dark:text-black" />
            </div>
            <div className="grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate text-lg leading-tight font-semibold">
                    ORPHEUS
                </span>
            </div>
        </>
    );
}
