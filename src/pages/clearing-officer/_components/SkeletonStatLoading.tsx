import { CardContent } from "@/components/ui/card";
import { Card } from "antd";

const SkeletonStatLoading = () => {
  return (
    <Card className="border-0 bg-gray-200 animate-pulse">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
          <div className="h-12 w-12 bg-gray-300 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonStatLoading;
