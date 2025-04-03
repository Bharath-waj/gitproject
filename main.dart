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
    Timer(Duration(seconds: 3), () {
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
        child: Image.asset('assets/icon.png', width: 150),//icon your file
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text("Home Page"),
          bottom: TabBar(
            tabs: [
              Tab(text: "AI"),
              Tab(text: "Carbon Footprint"),
              Tab(text: "Plant Growth"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            AIScreen(),
            CarbonFootprintScreen(),
            PlantGrowthScreen(),
          ],
        ),
      ),
    );
  }
}

class AIScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("AI Content Here", style: TextStyle(fontSize: 18)),
    );
  }
}

class CarbonFootprintScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("Carbon Footprint Content Here", style: TextStyle(fontSize: 18)),
    );
  }
}

class PlantGrowthScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text("Plant Growth Content Here", style: TextStyle(fontSize: 18)),
    );
  }
}
