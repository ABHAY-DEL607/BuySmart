import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.speedZ = (Math.random() - 0.5) * 2;
                this.color = `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 50}%)`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.z += this.speedZ;

                // Wrap around edges
                if (this.x < 0) this.x += canvas.width;
                if (this.x > canvas.width) this.x -= canvas.width;
                if (this.y < 0) this.y += canvas.height;
                if (this.y > canvas.height) this.y -= canvas.height;
                if (this.z < 0) this.z += 1000;
                if (this.z > 1000) this.z -= 1000;
            }

            draw() {
                const perspective = 1000 / (1000 + this.z);
                const px = (this.x - canvas.width / 2) * perspective + canvas.width / 2;
                const py = (this.y - canvas.height / 2) * perspective + canvas.height / 2;
                const size = this.size * perspective;

                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = Math.max(0, 1 - this.z / 1000);
                ctx.fill();
            }
        }

        // Initialize particles
        const particles = Array.from({ length: 200 }, () => new Particle());

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(30, 58, 138, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = (particles[i].x - canvas.width / 2) * (1000 / (1000 + particles[i].z)) + canvas.width / 2 -
                              (particles[j].x - canvas.width / 2) * (1000 / (1000 + particles[j].z)) + canvas.width / 2;
                    const dy = (particles[i].y - canvas.height / 2) * (1000 / (1000 + particles[i].z)) + canvas.height / 2 -
                              (particles[j].y - canvas.height / 2) * (1000 / (1000 + particles[j].z)) + canvas.height / 2;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(
                            (particles[i].x - canvas.width / 2) * (1000 / (1000 + particles[i].z)) + canvas.width / 2,
                            (particles[i].y - canvas.height / 2) * (1000 / (1000 + particles[i].z)) + canvas.height / 2
                        );
                        ctx.lineTo(
                            (particles[j].x - canvas.width / 2) * (1000 / (1000 + particles[j].z)) + canvas.width / 2,
                            (particles[j].y - canvas.height / 2) * (1000 / (1000 + particles[j].z)) + canvas.height / 2
                        );
                        ctx.strokeStyle = 'rgba(125, 211, 252, ' + (1 - distance / 100) * 0.3 + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="canvas-bg" />;
};

export default ParticleBackground;