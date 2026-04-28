import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const devServerHost = process.env.VITE_DEV_SERVER_HOST ?? '127.0.0.1';
const devServerPort = Number(process.env.VITE_DEV_SERVER_PORT ?? 5173);
const hmrHost = process.env.VITE_HMR_HOST;
const hmrProtocol = process.env.VITE_HMR_PROTOCOL ?? 'ws';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: devServerHost,
        port: devServerPort,
        ...(hmrHost
            ? {
                  hmr: {
                      host: hmrHost,
                      protocol: hmrProtocol,
                  },
              }
            : {}),
    },
});



