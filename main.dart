import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

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


class AIScreen extends StatefulWidget {
  @override
  _AIScreenState createState() => _AIScreenState();
}

class _AIScreenState extends State<AIScreen> {
  final TextEditingController _controller = TextEditingController();
  String _response = '';
  bool _loading = false;

  Future<void> fetchAIResponse(String prompt) async {
    setState(() {
      _loading = true;
      _response = '';
    });

    final url = Uri.parse('http://192.168.29.230:3000/chat');

    try {
      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'prompt': prompt}),
      );

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final message = data['reply'];
        setState(() {
          _response = message;
        });
      } else {
        setState(() {
          _response = 'Server error: ${res.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        _response = 'Failed to connect to server: $e';
      });
    }

    setState(() {
      _loading = false;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("AI Assistant")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: InputDecoration(
                labelText: "Ask a question",
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                if (_controller.text.isNotEmpty) {
                  fetchAIResponse(_controller.text);
                }
              },
              child: Text("Get Response"),
            ),
            SizedBox(height: 20),
            _loading
                ? CircularProgressIndicator()
                : Expanded(
              child: SingleChildScrollView(
                child: Text(
                  _response,
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}


class PlantGrowthScreen extends StatefulWidget {
  @override
  _PlantGrowthScreenState createState() => _PlantGrowthScreenState();
}

class _PlantGrowthScreenState extends State<PlantGrowthScreen> {
  final TextEditingController _plantController = TextEditingController();
  String _careTip = '';
  String _remedy = '';

  final Map<String, String> plantCareTips = {
    'Rose': 'Full sunlight, water regularly, prune often.',
    'Money Plant': 'Indirect light, water when soil is dry.',
    'Tulsi': 'Plenty of sunlight, water daily.',
    'Marigold': 'Full sun, regular watering.',
    'Hibiscus': 'Lots of sunlight, keep soil moist.',
    'Sunflower': 'Full sun, water when topsoil is dry.',
    'Mint': 'Partial shade, water regularly.',
    'Basil': 'Full sun, water when soil feels dry.',
    'Curry Leaf': 'Full sun, well-draining soil, moderate watering.',
    'Chrysanthemum': 'Bright light, water evenly.',
    'Snake Plant': 'Low light, water when soil is dry.',
    'Peace Lily': 'Indirect light, keep soil moist.',
    'Aloe Vera': 'Bright light, water sparingly.',
    'Spider Plant': 'Bright, indirect light; water moderately.',
    'ZZ Plant': 'Low light, water when soil is dry.',
    'Monstera': 'Bright, indirect light; water when topsoil is dry.',
    'Jade Plant': 'Bright light, water when soil is dry.',
    'Succulent': 'Bright light, water when soil is dry.',
    'Lucky Bamboo': 'Keep roots in water, avoid direct sun.',
  };

  final Map<String, String> plantProblems = {
    'Yellowing Leaves': 'Overwatering or poor drainage. Let soil dry out.',
    'Brown Leaf Tips': 'Low humidity. Increase moisture around plant.',
    'Wilting': 'Underwatering or root rot. Adjust watering.',
    'Leaf Drop': 'Sudden temp changes. Stabilize environment.',
    'Spotted Leaves': 'Fungal infection. Remove spots and apply fungicide.',
    'Powdery Mildew': 'Fungus. Improve airflow, use fungicide.',
    'Root Rot': 'Too much water. Trim roots, repot.',
    'Pale Leaves': 'Lack of nutrients. Add fertilizer.',
    'Stunted Growth': 'Lack of light or nutrients.',
    'Leggy Growth': 'Needs more light.',
    'Leaf Curling': 'Possible pest attack. Check underside.',
    'Black Spots': 'Fungal issue. Remove affected parts.',
    'Moldy Soil': 'Overwatering. Allow to dry.',
    'Sticky Leaves': 'Aphids or pests. Wash leaves.',
    'Brown Patches': 'Sunburn. Provide indirect light.',
  };

  void _getCareTip() {
    final plantName = _plantController.text.trim();
    setState(() {
      _careTip = plantCareTips[plantName] ?? 'No care tip found for this plant.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('Plant Growth Tips')),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  TextField(
                    controller: _plantController,
                    decoration: InputDecoration(
                      labelText: 'Enter Plant Name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: _getCareTip,
                    child: Text('Get Care Tip'),
                  ),
                  SizedBox(height: 10),
                  Text(_careTip, style: TextStyle(fontSize: 16)),
                  Divider(height: 30),
                  DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Select Plant Problem',
                      border: OutlineInputBorder(),
                    ),
                    items: plantProblems.keys.map((String problem) {
                      return DropdownMenuItem<String>(
                        value: problem,
                        child: Text(problem),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _remedy = plantProblems[value]!;
                        });
                      }
                    },
                  ),
                  SizedBox(height: 10),
                  Text(_remedy, style: TextStyle(fontSize: 16)),
                ],
              ),
            ),
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
