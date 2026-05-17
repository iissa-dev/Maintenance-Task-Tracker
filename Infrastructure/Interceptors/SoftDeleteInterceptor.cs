using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Interceptors
{
    public class SoftDeleteInterceptor : SaveChangesInterceptor
    {
        public override ValueTask<InterceptionResult<int>>
            SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            if (eventData.Context is null)
                return ValueTask.FromResult(result);

            foreach(var entry in eventData.Context.ChangeTracker.Entries())
            {

                if(entry is not { State: EntityState.Deleted, Entity: ISoftDeleteable softDeleteable })
                    continue;

                entry.State = EntityState.Modified;
                softDeleteable.Delete();
            }

            return ValueTask.FromResult(result);
        }
    }
}
