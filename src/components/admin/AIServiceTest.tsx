import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testAIService, generateAIFeedback, AVAILABLE_MODELS } from '@/lib/aiService';
import { CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';

/**
 * AI Service Test Component
 * Use this to verify your OpenRouter API configuration
 * 
 * To use: Import this component in your admin panel or create a test route
 */
export default function AIServiceTest() {
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('');
  const [customReflection, setCustomReflection] = useState(
    'I learned how to implement authentication in my React app using Firebase. It was challenging at first, but I managed to set up user login and registration.'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const runQuickTest = async () => {
    setTestResult('testing');
    setErrorMessage('');
    setFeedback('');
    
    try {
      const success = await testAIService();
      setTestResult(success ? 'success' : 'error');
      if (!success) {
        setErrorMessage('Test failed. Check console for details.');
      }
    } catch (error: any) {
      setTestResult('error');
      setErrorMessage(error.message || 'Unknown error occurred');
    }
  };

  const generateCustomFeedback = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setFeedback('');
    
    try {
      const result = await generateAIFeedback({
        studentName: 'Test Student',
        learningReflection: customReflection,
        submissionType: 'weekly',
        weekNumber: 1,
        skillLevel: 'beginner'
      });
      
      setFeedback(result.feedback);
      setModelUsed(result.model || 'unknown');
      setTestResult('success');
    } catch (error: any) {
      setTestResult('error');
      setErrorMessage(error.message || 'Failed to generate feedback');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = () => {
    switch (testResult) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'testing': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const apiKeyConfigured = import.meta.env.VITE_OPENROUTER_API_KEY && 
                          import.meta.env.VITE_OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Service Configuration Test</h1>
        <p className="text-gray-600">Verify your OpenRouter API setup</p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="font-medium">OpenRouter API Key</span>
            {apiKeyConfigured ? (
              <Badge className="bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-4 w-4 mr-1" />
                Not Configured
              </Badge>
            )}
          </div>

          {!apiKeyConfigured && (
            <Alert>
              <AlertDescription>
                <strong>Setup Required:</strong> Add your OpenRouter API key to <code>.env.local</code>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
                </pre>
                Then restart the dev server with <code>npm run dev</code>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="font-medium">Site URL</span>
            <code className="text-sm">{import.meta.env.VITE_SITE_URL || 'Default'}</code>
          </div>
        </CardContent>
      </Card>

      {/* Quick Test */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test</CardTitle>
          <CardDescription>Run a simple test to verify the AI service</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runQuickTest} 
            disabled={!apiKeyConfigured || testResult === 'testing'}
            className="w-full"
          >
            {testResult === 'testing' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run Quick Test
              </>
            )}
          </Button>

          {testResult !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg border ${getStatusColor()}`}>
              {testResult === 'success' && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Test Passed! AI service is working.</span>
                </div>
              )}
              {testResult === 'error' && (
                <div className="text-red-700">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Test Failed</span>
                  </div>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Feedback Test */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Feedback</CardTitle>
          <CardDescription>Test feedback generation with custom input</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Learning Reflection</label>
            <Textarea
              value={customReflection}
              onChange={(e) => setCustomReflection(e.target.value)}
              rows={4}
              placeholder="Enter a student learning reflection..."
            />
          </div>

          <Button 
            onClick={generateCustomFeedback} 
            disabled={!apiKeyConfigured || isGenerating || !customReflection.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Feedback
              </>
            )}
          </Button>

          {feedback && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-800">Generated Feedback</span>
                {modelUsed && (
                  <Badge variant="outline" className="text-xs">
                    Model: {modelUsed}
                  </Badge>
                )}
              </div>
              <p className="text-gray-700">{feedback}</p>
            </div>
          )}

          {errorMessage && !feedback && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Models */}
      <Card>
        <CardHeader>
          <CardTitle>Available Models</CardTitle>
          <CardDescription>AI models you can use (configured in aiService.ts)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(AVAILABLE_MODELS).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg border bg-gray-50">
                <div className="font-medium text-sm">{key}</div>
                <code className="text-xs text-gray-600">{value}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>📖 See <code>OPENROUTER_SETUP.md</code> for detailed setup instructions.</p>
          <div className="space-y-1 pl-4">
            <p>1. Get API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">openrouter.ai/keys</a></p>
            <p>2. Add to <code>.env.local</code> file</p>
            <p>3. Restart dev server</p>
            <p>4. Run tests above</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
