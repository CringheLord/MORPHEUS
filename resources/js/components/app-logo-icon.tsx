import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
    darkVariant?: 'dark' | 'dark_2';
};

export default function AppLogoIcon({
                                        className,
                                        alt = 'MORPHEUS logo',
                                        darkVariant = 'dark_2',
                                        ...props
                                    }: Props) {
    const darkSrc =
        darkVariant === 'dark'
            ? '/Logo/Logo_dark.png'
            : '/Logo/Logo_dark_noBG.png';

    return (
        <>
            <img
                src="/Logo/Logo_light_noBG.png"
                alt={alt}
                className={cn('block dark:hidden bg-blend-color scale-x-230  scale-y-140', className)}
                {...props}
            />
            <img
                src={darkSrc}
                alt={alt}
                className={cn('hidden dark:block bg-blend-color scale-x-120 scale-y-130', className)}
                {...props}
            />
        </>
    );
}
