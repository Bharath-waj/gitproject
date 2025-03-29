import 'package:flutter/material.dart';

void main() {
  runApp(TicTacToeApp());
}

class TicTacToeApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: TicTacToeGame(),
    );
  }
}

class TicTacToeGame extends StatefulWidget {
  @override
  _TicTacToeGameState createState() => _TicTacToeGameState();
}

class _TicTacToeGameState extends State<TicTacToeGame> {
  List<String> board = List.filled(9, "");
  bool isXTurn = true;
  String? winner;

  void _handleTap(int index) {
    if (board[index] != "" || winner != null) return;

    setState(() {
      board[index] = isXTurn ? "X" : "O";
      isXTurn = !isXTurn;
      winner = _checkWinner();
    });
  }

  String? _checkWinner() {
    List<List<int>> winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (var combo in winningCombinations) {
      String a = board[combo[0]], b = board[combo[1]], c = board[combo[2]];
      if (a != "" && a == b && b == c) {
        return a;
      }
    }
    return board.contains("") ? null : "Draw";
  }

  void _resetGame() {
    setState(() {
      board = List.filled(9, "");
      isXTurn = true;
      winner = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Tic Tac Toe")),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded( // Wrap GridView.builder in Expanded
            child: GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                childAspectRatio: 1.0,
              ),
              itemCount: 9,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () => _handleTap(index),
                  child: Container(
                    margin: EdgeInsets.all(5.0),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.black),
                      color: Colors.grey[200],
                    ),
                    child: Center(
                      child: Text(
                        board[index],
                        style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 20),
          if (winner != null)
            Text(
              winner == "Draw" ? "It's a Draw!" : "Winner: $winner",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          SizedBox(height: 20),
          ElevatedButton(onPressed: _resetGame, child: Text("Restart")),
        ],
      ),
    );
  }
}