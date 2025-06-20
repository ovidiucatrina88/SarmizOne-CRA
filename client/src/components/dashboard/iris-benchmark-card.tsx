import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface IRISBenchmarkData {
  currentRisk: number;
  totalPortfolioRisk: number;
  smbBenchmark: number;
  enterpriseBenchmark: number;
  industryPosition: 'above_smb' | 'below_enterprise' | 'between' | 'above_enterprise';
  maturityScore: number;
  recommendations: string[];
  riskCount: number;
  avgRiskSize: number;
  portfolioComparison: {
    smbMultiple: number;
    enterpriseMultiple: number;
    positioning: string;
  };
}

const IRISBenchmarkCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/iris-benchmarks'],
  });

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 pb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>IRIS 2025 Benchmarks</span>
          </CardTitle>
          <CardDescription>Industry risk comparison data unavailable</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const benchmarkData: IRISBenchmarkData = data.data;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get position color and icon
  const getPositionIndicator = (position: string) => {
    switch (position) {
      case 'above_enterprise':
        return {
          color: 'destructive',
          icon: TrendingUp,
          text: 'Above Enterprise Average',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-700 dark:text-red-400'
        };
      case 'between':
        return {
          color: 'warning',
          icon: Target,
          text: 'Enterprise Range',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-700 dark:text-yellow-400'
        };
      case 'above_smb':
        return {
          color: 'secondary',
          icon: TrendingDown,
          text: 'Above SMB Average',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-700 dark:text-blue-400'
        };
      default:
        return {
          color: 'outline',
          icon: Target,
          text: 'Below Industry Average',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-700 dark:text-green-400'
        };
    }
  };

  const positionInfo = getPositionIndicator(benchmarkData.industryPosition);
  const PositionIcon = positionInfo.icon;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          <span>IRIS 2025 Industry Benchmarks</span>
        </CardTitle>
        <CardDescription>
          Risk position vs industry standards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Industry Position Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PositionIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Industry Position</span>
          </div>
          <Badge 
            variant={positionInfo.color as any}
            className={`${positionInfo.bgColor} ${positionInfo.textColor} border-0`}
          >
            {positionInfo.text}
          </Badge>
        </div>

        {/* Risk Comparison Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Your Average Risk</p>
              <p className="font-semibold text-lg">{formatCurrency(benchmarkData.avgRiskSize)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Portfolio Risks</p>
              <p className="font-semibold text-lg">{benchmarkData.riskCount}</p>
            </div>
          </div>

          {/* Industry Comparison Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>SMB Benchmark</span>
                <span>{formatCurrency(benchmarkData.smbBenchmark)}</span>
              </div>
              <Progress 
                value={Math.min(100, (benchmarkData.avgRiskSize / benchmarkData.smbBenchmark) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {benchmarkData.portfolioComparison.smbMultiple}x SMB average
              </p>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Enterprise Benchmark</span>
                <span>{formatCurrency(benchmarkData.enterpriseBenchmark)}</span>
              </div>
              <Progress 
                value={Math.min(100, (benchmarkData.avgRiskSize / benchmarkData.enterpriseBenchmark) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {benchmarkData.portfolioComparison.enterpriseMultiple}x Enterprise average
              </p>
            </div>
          </div>
        </div>

        {/* Risk Maturity Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Risk Maturity Score</span>
            <span className="text-lg font-bold">{benchmarkData.maturityScore}/100</span>
          </div>
          <Progress value={benchmarkData.maturityScore} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {benchmarkData.maturityScore >= 80 ? 'Excellent' : 
             benchmarkData.maturityScore >= 60 ? 'Good' : 
             benchmarkData.maturityScore >= 40 ? 'Fair' : 'Needs Improvement'}
          </p>
        </div>

        {/* Top Recommendations */}
        {benchmarkData.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Key Recommendations</h4>
            <div className="space-y-1">
              {benchmarkData.recommendations.slice(0, 2).map((rec, index) => (
                <p key={index} className="text-xs text-muted-foreground leading-relaxed">
                  • {rec}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IRISBenchmarkCard;