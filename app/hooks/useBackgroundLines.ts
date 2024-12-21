import { useState, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
    branch?: boolean;
}

interface Line {
    id: number;
    left: number;
    width: number;
    color: string;
    points: Point[];
    maxPoints: number;
    speed: number;
    wavelength: number;
    phase: number;
    branches: Line[];
    height?: number;
    delay?: number;
    currentAngle?: number;
    isMovingVertical: boolean;
    lastDirectionChangeY: number;
    nextDirectionChangeLength?: number;
    direction: 'vertical' | 'horizontal';
    amplitude: number;
    straightLineTime: number;
    targetAngle?: number;
    angleTransitionProgress?: number;
    isChangingDirection: boolean;
    isMovingStraight: boolean;
    isFirstMove: boolean;
}

export function useBackgroundLines(
    baseColor: 'cyan' | 'fuchsia', 
    direction: 'vertical' | 'horizontal' = 'vertical',
    isDark?: boolean,
    isHovered?: boolean
) {
    const [lines, setLines] = useState<Line[]>(() => {
        if (direction === 'horizontal') {
            return Array.from({ length: 1 }, () => createInitialLine([]));
        }
        return [];
    });
    const [lastCreateTime, setLastCreateTime] = useState(0);

    function createInitialLine(existingLines: Line[]) {
        const id = Math.random();
        let left: number;
        
        if (direction === 'horizontal') {
            left = -10;
        } else {
            const getValidPosition = (existingLines: Line[]): number => {
                const minDistance = 15;
                let attempts = 0;
                let position: number;

                do {
                    position = Math.random() * 100;
                    const isFarEnough = existingLines.every(line =>
                        Math.abs(line.left - position) > minDistance
                    );

                    if (isFarEnough || attempts > 10) return position;
                    attempts++;
                } while (true);
            };

            left = getValidPosition(existingLines);
        }

        const width = Math.random() * 2.5 + 2.5;
        const maxPoints = direction === 'horizontal' ? 400 : 200;
        const speed = Math.random() * 0.8 + 0.8;
        const wavelength = Math.random() * 80 + 60;
        const phase = Math.random() * Math.PI * 2;

        const hueVariation = Math.random() * 20 - 10;
        const baseHue = baseColor === 'fuchsia' ? 300 : 180;
        const hue = baseHue + hueVariation;
        const saturation = 60 + Math.random() * 10;
        let lightness = 70 + Math.random() * 10;

        if (direction === 'horizontal') {
            if (isHovered) {
                lightness = isDark ? 80 : 40;
            } else {
                lightness = isDark ? 40 : 80;
            }
        }

        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        const startY = direction === 'horizontal'
            ? Math.random() * 100
            : -10;

        return {
            id, left, width, color, maxPoints,
            points: [{ x: 0, y: startY, branch: false }],
            speed, wavelength, phase,
            branches: [],
            isMovingVertical: direction === 'vertical',
            lastDirectionChangeY: startY,
            direction,
            nextDirectionChangeLength: direction === 'horizontal'
                ? Math.random() * 200 + 100
                : undefined,
            currentAngle: 0,
            isMovingStraight: true,
            straightLineTime: 0,
            isFirstMove: true
        };
    }

    useEffect(() => {
        if (lines.length === 0 && direction === 'vertical') {
            setLines(Array.from({ length: 2 }, () => createInitialLine([])));
        }

        const updateLinePosition = (line: Line, allLines: Line[]): Line => {
            const newPoints = [...line.points];
            const lastPoint = newPoints[newPoints.length - 1];

            if (direction === 'horizontal') {
                if (line.nextDirectionChangeLength === undefined) {
                    line.nextDirectionChangeLength = Math.random() * 400 + 600;
                }

                const currentLength = lastPoint.x - (line.points[0].x || 0);

                if (currentLength >= line.nextDirectionChangeLength) {
                    if (line.isMovingStraight) {
                        line.isMovingStraight = false;
                        const angle = (Math.random() * 0.2 + 0.2) * Math.PI / 2;
                        line.currentAngle = Math.random() < 0.5 ? angle : -angle;
                        line.nextDirectionChangeLength = Math.random() * 200 + 200;
                    } else {
                        line.isMovingStraight = true;
                        line.currentAngle = 0;
                        line.nextDirectionChangeLength = Math.random() * 400 + 600;
                    }
                }

                const speedX = line.speed;
                const speedY = Math.sin(line.currentAngle || 0) * line.speed;

                const newPoint = {
                    x: lastPoint.x + speedX,
                    y: lastPoint.y + speedY,
                    branch: false
                };
                newPoints.push(newPoint);
            } else {
                const shouldBranch = Math.random() < 0.0005 && !lastPoint.branch;

                if (line.nextDirectionChangeLength === undefined) {
                    line.nextDirectionChangeLength = line.isMovingVertical
                        ? Math.random() * 100 + 100
                        : Math.random() * 30 + 30;
                }

                const currentLength = lastPoint.y - (line.lastDirectionChangeY || lastPoint.y);

                if (currentLength >= line.nextDirectionChangeLength) {
                    line.isMovingVertical = !line.isMovingVertical;
                    line.lastDirectionChangeY = lastPoint.y;

                    line.nextDirectionChangeLength = line.isMovingVertical
                        ? Math.random() * 100 + 100
                        : Math.random() * 30 + 30;

                    if (!line.isMovingVertical) {
                        const angle = (Math.random() * 0.35 + 0.35) * Math.PI / 2;
                        line.currentAngle = Math.random() < 0.5 ? angle : -angle;
                    }
                }

                const baseSpeed = line.speed;
                const currentSpeed = baseSpeed * (Math.random() * 0.4 + 0.8);

                const moveAngle = line.isMovingVertical ? 0 : (line.currentAngle || 0);
                const speedX = Math.sin(moveAngle) * currentSpeed;
                const speedY = Math.max(Math.cos(moveAngle) * currentSpeed, currentSpeed * 0.7);

                const newPoint = {
                    x: lastPoint.x + speedX,
                    y: lastPoint.y + speedY,
                    branch: shouldBranch
                };

                newPoints.push(newPoint);

                if (newPoint.branch) {
                    const branchLine = createInitialLine(allLines);
                    branchLine.points[0] = {
                        x: newPoint.x,
                        y: newPoint.y,
                        branch: false
                    };
                    branchLine.left = line.left;
                    branchLine.width = line.width;
                    branchLine.color = line.color;
                    branchLine.speed = line.speed;

                    branchLine.isMovingVertical = false;
                    branchLine.lastDirectionChangeY = newPoint.y;
                    const branchAngle = (Math.random() * 0.35 + 0.35) * Math.PI / 2;
                    branchLine.currentAngle = Math.random() < 0.5 ? branchAngle : -branchAngle;

                    line.branches.push(branchLine);
                }
            }

            if (newPoints.length > line.maxPoints) {
                newPoints.shift();
            }

            return { ...line, points: newPoints, branches: [] };
        };

        const interval = setInterval(() => {
            const currentTime = Date.now();

            setLines(prev => {
                let newLines = prev.map(line => updateLinePosition(line, prev));

                if (direction === 'horizontal') {
                    newLines = newLines.slice(0, 1);
                }

                newLines = newLines.map(line => {
                    const lastPoint = line.points[line.points.length - 1];
                    const maxX = window.innerWidth + 300;
                    const maxY = window.innerHeight + 300;

                    if ((direction === 'horizontal' && lastPoint.x > maxX) ||
                        (direction === 'vertical' && lastPoint.y > maxY)) {
                        return createInitialLine(newLines);
                    }
                    return line;
                });

                const minTimeBetweenCreations = 2000;
                const createChance = Math.max(0.008, 0.03 - newLines.length * 0.007);
                if (Math.random() < createChance &&
                    newLines.length < 4 &&
                    currentTime - lastCreateTime > minTimeBetweenCreations) {
                    setLastCreateTime(currentTime);
                    newLines = [...newLines, createInitialLine(newLines)];
                }

                return newLines;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [direction]);

    useEffect(() => {
        if (direction === 'horizontal') {
            setLines(prev => prev.map(line => ({
                ...line,
                color: `hsl(${line.color.split(',')[0].split('(')[1]}, ${line.color.split(',')[1]}, ${
                    isHovered 
                        ? (isDark ? '80%' : '40%')
                        : (isDark ? '40%' : '80%')
                })`
            })));
        }
    }, [isDark, isHovered, direction]);

    return lines;
} 