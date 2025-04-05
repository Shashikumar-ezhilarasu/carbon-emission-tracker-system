import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { getEmissions, addRecommendation } from '@/lib/firebaseConfig';

export async function POST() {
  try {
    // Get emissions data from Firebase
    const emissionsData = await getEmissions();
    
    // Convert data to JSON string
    const inputData = JSON.stringify(emissionsData);
    
    // Spawn Python process to run the ML model
    const pythonProcess = spawn('python', ['ml/recommendation_model.py']);
    
    // Send data to Python process
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
    
    // Collect output from Python process
    let output = '';
    for await (const chunk of pythonProcess.stdout) {
      output += chunk;
    }
    
    // Wait for process to complete
    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });
    
    if (exitCode !== 0) {
      throw new Error('Python process failed');
    }
    
    // Parse recommendations
    const recommendations = JSON.parse(output);
    
    // Save recommendations to Firebase
    for (const recommendation of recommendations) {
      await addRecommendation({
        ...recommendation,
        timestamp: new Date(),
        status: 'Pending'
      });
    }
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 