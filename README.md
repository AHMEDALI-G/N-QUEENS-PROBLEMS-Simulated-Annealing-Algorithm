# N-QUEENS-PROBLEMS-Simulated-Annealing-Algorithm
"Implementation of the N-Queens problem using a simulated annealing algorithm. This repository demonstrates optimization techniques to efficiently find valid board configurations, avoiding local minima and improving solution quality through probabilistic search."
♛ N-Queens using Simulated Annealing

This repository contains an implementation of the N-Queens problem solved using a Simulated Annealing algorithm. The goal is to place N queens on an N×N chessboard such that no two queens attack each other.

🚀 Features
Uses probabilistic optimization (Simulated Annealing)
Avoids local minima effectively
Works for different board sizes (N)
Simple and easy-to-understand implementation
🧠 Algorithm Overview

Simulated Annealing is inspired by the annealing process in metallurgy. It explores possible solutions and occasionally accepts worse states to escape local optima, gradually improving towards a global solution.

📂 Project Structure
.
├── main.py
├── solver.py
├── README.md
▶️ How to Run
python main.py
⚙️ Parameters
N: Number of queens (board size)
Initial temperature
Cooling rate

You can tweak these to improve performance.

📌 Example Output
Solution for N=8:
. Q . . . . . .
. . . . Q . . .
. . . . . . Q .
Q . . . . . . .
. . Q . . . . .
. . . . . Q . .
. . . Q . . . .
. . . . . . . Q
📖 Future Improvements
Visualization of the board
Performance comparison with other algorithms
GUI implementation
🤝 Contributing

Feel free to fork this repo and submit pull requests.

📜 License

This project is open-source and available under the MIT License.
