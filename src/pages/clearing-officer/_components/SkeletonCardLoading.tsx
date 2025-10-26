import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SkeletonCardLoading = () => {
  return (
    <div>
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
                <div className="h-5 w-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-4/6 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Course Info skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-start gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule skeleton */}
          <div className="border-t pt-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2 ml-6">
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonCardLoading;
