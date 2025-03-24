import SeoQuiz from '@/components/SeoQuiz';

export default function SeoQuizPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">SEO Knowledge Assessment</h1>
      <p className="text-center max-w-2xl mx-auto mb-8 text-muted-foreground">
        Test your knowledge of SEO best practices with real-world scenarios. 
        Analyze website content, select relevant keywords, and interpret performance data 
        to demonstrate your understanding of search engine optimization.
      </p>
      <SeoQuiz />
    </div>
  );
}