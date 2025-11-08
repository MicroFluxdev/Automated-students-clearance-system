# Requirement Status Sync Documentation

## Overview

This feature provides **automatic synchronization** of student requirement statuses based on due date changes. When a clearing officer updates a requirement's due date, the system automatically adjusts student statuses according to predefined business rules.

## Business Logic

### When Due Date Passes

When a requirement's due date has passed (current time > due date):

- **incomplete** → **missing** ✅
- **signed** → **signed** (no change) ✅

### When Due Date is Extended

When a requirement's due date is extended to a future date:

- **missing** → **incomplete** ✅
- **signed** → **signed** (no change) ✅
- **incomplete** → **incomplete** (no change) ✅

### Status Preservation Rules

- **Signed statuses are ALWAYS preserved** - Students who have completed and signed their requirements maintain that status regardless of deadline changes.
- Status changes happen **automatically in the background** - No manual intervention required.
- Changes are **non-blocking** - UI updates happen immediately; status sync runs asynchronously.

## Architecture

### Services Created/Modified

#### 1. `requirementStatusSyncService.ts` (New)

Main service handling all status synchronization logic.

**Key Functions:**

```typescript
// Sync statuses when a requirement's due date changes
syncStudentStatusesOnDueDateChange(
  requirementId: string,
  newDueDate: string | Date,
  oldDueDate?: string | Date
): Promise<StatusSyncResult>

// Batch sync all requirements (useful for cleanup jobs)
batchSyncAllRequirementStatuses(): Promise<StatusSyncResult>

// Preview changes before applying them
previewStatusChanges(
  requirementId: string,
  newDueDate: string | Date,
  oldDueDate?: string | Date
): Promise<Array<ChangePreview>>

// Sync institutional requirement statuses
syncInstitutionalRequirementStatuses(
  institutionalRequirementId: string,
  newDeadline: string | Date,
  oldDeadline?: string | Date
): Promise<StatusSyncResult>
```

#### 2. `requirementService.ts` (Enhanced)

Added automatic status sync trigger to `updateRequirement()`.

```typescript
// Update requirement with automatic status sync
updateRequirement(
  id: string,
  data: RequirementUpdatePayload,
  options?: { skipStatusSync?: boolean } // Optional: skip sync
): Promise<RequirementData>
```

**Default Behavior:**
- Automatically detects due date changes
- Fetches old due date
- Triggers background sync
- Returns immediately (non-blocking)

**Opt-out:**
```typescript
// Skip automatic sync if needed
updateRequirement(id, data, { skipStatusSync: true });
```

#### 3. `institutionalRequirementsService.ts` (Enhanced)

Similar enhancement for institutional requirements.

```typescript
updateInstitutionalRequirement(
  id: string,
  data: Partial<CreateInstitutionalRequirementPayload>,
  options?: { skipStatusSync?: boolean }
): Promise<RequirementData>
```

#### 4. `deadlineStatusService.ts` (Enhanced)

Added utility functions for deadline comparison and formatting.

**New Functions:**
- `isDeadlineExtended()` - Check if deadline was extended
- `isDeadlineShortened()` - Check if deadline was shortened
- `getDeadlineStatus()` - Get status category for UI styling
- `formatTimeRemaining()` - Human-readable time formatting

## Usage Examples

### Basic Usage (Automatic)

```typescript
import { updateRequirement } from "@/services/requirementService";

// Update requirement due date - status sync happens automatically
const handleSaveEdit = async (id: string, newDueDate: string) => {
  const result = await updateRequirement(id, {
    dueDate: newDueDate
  });

  // UI updates immediately
  // Status sync runs in background
  // Check console for sync results
};
```

### Manual Sync (Advanced)

```typescript
import { syncStudentStatusesOnDueDateChange } from "@/services/requirementStatusSyncService";

// Manually trigger status sync
const handleManualSync = async () => {
  const result = await syncStudentStatusesOnDueDateChange(
    "requirement-id-123",
    "2025-12-31T23:59:59Z",
    "2025-11-30T23:59:59Z"
  );

  console.log(`Updated ${result.updatedCount} students`);
  console.log(`Failed: ${result.failedCount}`);

  if (result.errors.length > 0) {
    result.errors.forEach(err => {
      console.error(`Student ${err.studentId}: ${err.error}`);
    });
  }
};
```

### Preview Changes Before Applying

```typescript
import { previewStatusChanges } from "@/services/requirementStatusSyncService";

// Show user what will change before confirming
const handlePreview = async () => {
  const changes = await previewStatusChanges(
    "requirement-id-123",
    "2025-12-31T23:59:59Z",
    "2025-11-30T23:59:59Z"
  );

  changes.forEach(change => {
    console.log(
      `Student ${change.studentId}: ${change.currentStatus} → ${change.newStatus}`,
      `Reason: ${change.reason}`
    );
  });

  // Show confirmation modal with changes
  // Then apply if user confirms
};
```

### Batch Sync (Scheduled Jobs)

```typescript
import { batchSyncAllRequirementStatuses } from "@/services/requirementStatusSyncService";

// Run periodic cleanup to catch any missed updates
const runNightlySync = async () => {
  console.log("Starting nightly status sync...");

  const result = await batchSyncAllRequirementStatuses();

  console.log(`Nightly sync completed: ${result.updatedCount} updates`);

  if (!result.success) {
    console.error(`Sync had ${result.failedCount} failures`);
    // Alert administrators
  }
};
```

### Skip Automatic Sync

```typescript
import { updateRequirement } from "@/services/requirementService";

// Skip automatic sync if you want to handle it manually
const handleUpdate = async (id: string, data: RequirementUpdatePayload) => {
  const result = await updateRequirement(id, data, {
    skipStatusSync: true
  });

  // Handle sync manually later
  // ...
};
```

## Integration Points

### Where Status Sync is Triggered

1. **Clearing Officer Requirements** (`Clearance.tsx`)
   - When editing requirement via `handleSaveEditedRequirement()`
   - Automatic sync on due date change

2. **Institutional Requirements** (`Requirements.tsx`)
   - When editing institutional requirement via `handleSaveEdit()`
   - Automatic sync on deadline change

### Backend Requirements

The institutional requirement sync calls:
```
POST /institutional/syncStatuses/:id
```

**Request Body:**
```json
{
  "newDeadline": "2025-12-31T23:59:59Z",
  "oldDeadline": "2025-11-30T23:59:59Z"
}
```

**Response:**
```json
{
  "result": {
    "success": true,
    "updatedCount": 15,
    "failedCount": 0,
    "errors": []
  }
}
```

**Note:** If this endpoint doesn't exist, the frontend will log a helpful message suggesting its implementation. The regular requirement sync works entirely on the frontend.

## Monitoring and Debugging

### Console Logs

The service provides detailed console logging:

```
🔄 Starting student status sync for requirement: abc123
   - New due date: 2025-12-31T23:59:59Z
   - Old due date: 2025-11-30T23:59:59Z
   - Found 25 student requirements to process
   - New deadline passed? false
   - Is deadline extension? true

   📝 Student student-001: missing → incomplete (deadline extended)
   📝 Student student-002: missing → incomplete (deadline extended)
   ✅ Student student-003: status remains signed
   ⏭️  Student student-004: no status change needed (current: incomplete)

✅ Status sync completed:
   - Updated: 15
   - Failed: 0
   - Errors: 0
```

### Error Handling

All errors are caught and logged. Status sync failures **do not block** the requirement update:

```typescript
// Requirement updates successfully even if sync fails
try {
  await updateRequirement(id, data);
  // ✅ Requirement updated
} catch (error) {
  // ❌ Only thrown if requirement update fails
  // Status sync errors are logged but don't throw
}
```

## Performance Considerations

### Async Background Processing

- Status sync runs **asynchronously** (Promise without await)
- UI remains responsive during sync
- Updates process in parallel using `Promise.allSettled()`

### Optimization Tips

1. **Batch Updates:** Use `batchSyncAllRequirementStatuses()` for periodic cleanup instead of frequent small syncs
2. **Skip Unnecessary Syncs:** Pass `skipStatusSync: true` when due date isn't changing
3. **Monitor Logs:** Check console for performance bottlenecks

## Testing

### Test Scenarios

#### Scenario 1: Deadline Passes
```typescript
// Given: Requirement with future due date
// When: Due date is changed to past date
// Then: All "incomplete" students → "missing"
//       All "signed" students → remain "signed"
```

#### Scenario 2: Deadline Extended
```typescript
// Given: Requirement with passed due date
// When: Due date is extended to future
// Then: All "missing" students → "incomplete"
//       All "signed" students → remain "signed"
```

#### Scenario 3: No Date Change
```typescript
// Given: Requirement update without due date change
// When: Update is submitted
// Then: No status sync is triggered
```

## Troubleshooting

### Issue: Status sync not running

**Check:**
1. Is the due date actually changing?
2. Check console for warnings
3. Verify `skipStatusSync` is not set to `true`

### Issue: Some students not updating

**Check:**
1. Console logs for specific student errors
2. Network tab for failed API calls
3. Verify student requirement IDs exist

### Issue: Performance degradation

**Solutions:**
1. Run batch sync during off-peak hours
2. Implement backend endpoint for better performance
3. Add database indexes on `requirementId` and `status` fields

## Future Enhancements

### Potential Improvements

1. **Email Notifications**
   - Notify students when their status changes
   - Alert officers of sync completion

2. **UI Feedback**
   - Show toast notification with sync results
   - Display sync progress indicator

3. **Undo Functionality**
   - Allow reverting status changes
   - Maintain audit log of changes

4. **Webhook Support**
   - Trigger external systems on status changes
   - Integration with notification services

5. **Backend Migration**
   - Move sync logic entirely to backend
   - Use database triggers for real-time updates
   - Better transaction support

## API Reference

### StatusSyncResult Interface

```typescript
interface StatusSyncResult {
  success: boolean;          // Overall success flag
  updatedCount: number;      // Number of successful updates
  failedCount: number;       // Number of failed updates
  errors: Array<{            // Details of failures
    studentId: string;
    error: string;
  }>;
}
```

### ChangePreview Interface

```typescript
interface ChangePreview {
  studentId: string;         // Student identifier
  currentStatus: string;     // Current status value
  newStatus: string;         // New status value
  reason: string;            // Reason for change
}
```

## Best Practices

### Do's ✅

- Let automatic sync handle most cases
- Check console logs for sync results
- Use preview function for critical updates
- Monitor error rates in production
- Run batch sync periodically for cleanup

### Don'ts ❌

- Don't await status sync (it's async by design)
- Don't skip sync without good reason
- Don't ignore error logs
- Don't modify student statuses manually during sync
- Don't run batch sync too frequently

## Support

For questions or issues:
1. Check console logs first
2. Review this documentation
3. Contact the development team
4. File an issue with logs attached

---

**Version:** 1.0.0
**Last Updated:** 2025-11-08
**Author:** Senior Software Engineer Team
