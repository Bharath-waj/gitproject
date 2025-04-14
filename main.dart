import 'package:flutter/material.dart';
import 'dart:async';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 9), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => HomePage()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image.asset('assets/icon.png', width: 300, height: 300),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Home Page")),
      body: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildButton(context, 'assets/ai.png', AIScreen()),
            SizedBox(width: 20),
            _buildButton(context, 'assets/carbon.png', CarbonFootprintScreen()),
            SizedBox(width: 20),
            _buildButton(context, 'assets/plant.png', PlantGrowthScreen()),
          ],
        ),
      ),
    );
  }

  Widget _buildButton(BuildContext context, String imagePath, Widget targetScreen) {
    return SizedBox(
      width: 120,
      height: 120,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Color.fromRGBO(248, 248, 248, 1),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: EdgeInsets.all(8),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => targetScreen),
          );
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(imagePath, width: 100, height: 100),
            SizedBox(height: 5),
          ],
        ),
      ),
    );
  }
}

class AIScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("AI")),
      body: Center(
        child: Text("AI Content Here", style: TextStyle(fontSize: 18)),
      ),
    );
  }
}

class PlantGrowthScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Plant Growth")),
      body: Center(
        child: Text("Plant Growth Content Here", style: TextStyle(fontSize: 18)),
      ),
    );
  }
}

class CarbonFootprintScreen extends StatefulWidget {
  @override
  _CarbonFootprintScreenState createState() => _CarbonFootprintScreenState();
}

class _CarbonFootprintScreenState extends State<CarbonFootprintScreen> {
  int _currentQuestion = 0;
  Map<String, dynamic> answers = {};

  final List<Map<String, dynamic>> questions = [
    {
      'question': "How much electricity do you use daily?",
      'type': 'choice',
      'options': ['Less than 3 kWh', '3-5 kWh', '5-7 kWh', 'More than 7 kWh'],
      'key': 'electricity'
    },
    {
      'question': "How many meat meals do you eat per day?",
      'type': 'choice',
      'options': ['0', '1', '2', '3+'],
      'key': 'meat'
    },
    {
      'question': "How many hours do you drive per day?",
      'type': 'choice',
      'options': ['0', '1-2', '3-4', '5+'],
      'key': 'driving'
    },
    {
      'question': "How many hours do you fly per week?",
      'type': 'choice',
      'options': ['0', '< 2', '2-5', '5+'],
      'key': 'flights'
    },
    {
      'question': "What is your primary mode of transport?",
      'type': 'choice',
      'options': ['Walk', 'Bike', 'Public Transport', 'Car'],
      'key': 'transport'
    },
  ];

  void _nextStep(String choice) {
    final current = questions[_currentQuestion];
    answers[current['key']] = choice;

    if (_currentQuestion < questions.length - 1) {
      setState(() => _currentQuestion++);
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CarbonResultScreen(responses: answers),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final current = questions[_currentQuestion];

    return Scaffold(
      appBar: AppBar(title: Text("Carbon Footprint Poll")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                current['question'],
                style: TextStyle(fontSize: 20),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              ...current['options'].map<Widget>((opt) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: ElevatedButton(
                  onPressed: () => _nextStep(opt),
                  child: Text(opt),
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }
}

class CarbonResultScreen extends StatelessWidget {
  final Map<String, dynamic> responses;

  CarbonResultScreen({required this.responses});

  double _calculateScore() {
    double score = 0;

    switch (responses['electricity']) {
      case 'Less than 3 kWh': score += 1; break;
      case '3-5 kWh': score += 2; break;
      case '5-7 kWh': score += 3; break;
      case 'More than 7 kWh': score += 4; break;
    }

    switch (responses['meat']) {
      case '0': score += 0; break;
      case '1': score += 1; break;
      case '2': score += 2; break;
      case '3+': score += 3; break;
    }

    switch (responses['driving']) {
      case '0': score += 0; break;
      case '1-2': score += 1; break;
      case '3-4': score += 2; break;
      case '5+': score += 3; break;
    }

    switch (responses['flights']) {
      case '0': score += 0; break;
      case '< 2': score += 1; break;
      case '2-5': score += 2; break;
      case '5+': score += 3; break;
    }

    switch (responses['transport']) {
      case 'Walk': score += 0; break;
      case 'Bike': score += 1; break;
      case 'Public Transport': score += 2; break;
      case 'Car': score += 3; break;
    }

    return score;
  }

  String _getSuggestion(double score) {
    if (score <= 4) {
      return "Your carbon footprint is low. Great job! 🌱";
    } else if (score <= 8) {
      return "You're doing okay. Try cutting down on meat and drive less.";
    } else {
      return "Your footprint is high. Consider walking, biking, and reducing power usage.";
    }
  }

  @override
  Widget build(BuildContext context) {
    final score = _calculateScore();
    final suggestion = _getSuggestion(score);

    return Scaffold(
      appBar: AppBar(title: Text("Your Carbon Score")),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("Estimated Carbon Score", style: TextStyle(fontSize: 20)),
              SizedBox(height: 16),
              Text(score.toStringAsFixed(1),
                  style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
              SizedBox(height: 16),
              Text(suggestion, textAlign: TextAlign.center, style: TextStyle(fontSize: 18)),
            ],
          ),
        ),
      ),
    );
  }
}
