import { useForm, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { updPicture } from '@/routes/profile';

export default function UpdateProfilePicture() {
    const { auth } = usePage().props as any;
    const getInitials = useInitials();

    const { data, setData, patch, processing, errors, reset } = useForm<{
        image: File | null;
    }>({
        image: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-ignore
        patch(updPicture(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('image'),
        });
    };

    return (
        <section className="w-full bg-card border border-r-accent rounded-2xl p-4">
            <div className="bg-surface-container-high h-fit w-fit rounded-lg p-8 shadow-sm">
                <h2 className="text-surface-foreground leading-tight font-semibold">
                    Change Profile Picture
                </h2>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 overflow-hidden rounded-full">
                            <AvatarImage
                                src={auth.user.avatar ?? undefined}
                                alt={auth.user.name}
                            />
                            <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="grid gap-2">
                            <Label htmlFor="image">Profile picture</Label>

                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/gif"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="block w-full text-sm"
                            />

                            <InputError
                                className="mt-1"
                                message={errors.image}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
