import { Chart, ArcElement, LineElement, PointElement, BarElement } from 'chart.js';
import { CategoryScale, LinearScale } from 'chart.js';
import { PieController, LineController, BarController } from 'chart.js';
import { Tooltip, Legend } from 'chart.js';

// Register the required components
Chart.register(
    ArcElement,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PieController,
    LineController,
    BarController,
    Tooltip,
    Legend
);
