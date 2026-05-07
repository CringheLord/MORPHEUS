import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

export { gsap, useGSAP, ScrollTrigger, Flip };
