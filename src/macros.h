#ifndef MACROS_H
# define MACROS_H

#define UNUSED __attribute__((unused))

#define IGPROF_MERGE2(a,b)              a##b
#define IGPROF_MERGE3(a,b,c)            a##b##c

#define IGPROF_ARGS0()                  /* empty */
#define IGPROF_ARGS1(a)                 a
#define IGPROF_ARGS2(a,b)               a,b
#define IGPROF_ARGS3(a,b,c)             a,b,c
#define IGPROF_ARGS4(a,b,c,d)           a,b,c,d
#define IGPROF_ARGS5(a,b,c,d,e)         a,b,c,d,e
#define IGPROF_ARGS6(a,b,c,d,e,f)       a,b,c,d,e,f
#define IGPROF_ARGS7(a,b,c,d,e,f,g)     a,b,c,d,e,f,g

#define IGPROF_ARGSREST0()              /* empty */
#define IGPROF_ARGSREST1(a)             ,a
#define IGPROF_ARGSREST2(a,b)           ,a,b
#define IGPROF_ARGSREST3(a,b,c)         ,a,b,c
#define IGPROF_ARGSREST4(a,b,c,d)       ,a,b,c,d
#define IGPROF_ARGSREST5(a,b,c,d,e)     ,a,b,c,d,e
#define IGPROF_ARGSREST6(a,b,c,d,e,f)   ,a,b,c,d,e,f
#define IGPROF_ARGSREST7(a,b,c,d,e,f,g) ,a,b,c,d,e,f,g

#define IGPROF_DUAL_HOOK(n, ret, dofun, id1, id2, args, argnames, fun, v, lib)  \
    IGPROF_LIBHOOK(n, ret, dofun, id1, args, argnames, fun, 0, 0)               \
    IGPROF_LIBHOOK(n, ret, dofun, id2, args, argnames, fun, v, lib)

#define IGPROF_HOOK(n, ret, dofun, id, args, argnames, fun)                     \
    IGPROF_LIBHOOK(n, ret, dofun, id, args, argnames, fun, 0, 0)

#define IGPROF_LIBHOOK(n, ret, dofun, id, args, argnames, fun, v, lib)          \
    typedef ret igprof_##dofun##_t (IGPROF_MERGE2(IGPROF_ARGS,n) args);         \
    static ret dofun (IgHook::SafeData<igprof_##dofun##_t> &hook                \
                      IGPROF_MERGE2(IGPROF_ARGSREST,n) args);                   \
    static ret IGPROF_MERGE3(dofun,_stub_,id)(IGPROF_MERGE2(IGPROF_ARGS,n) args);\
    static IgHook::TypedData<ret(IGPROF_MERGE2(IGPROF_ARGS,n) args)> IGPROF_MERGE3(dofun,_hook,id) \
      = { { 0, fun, v, lib, &IGPROF_MERGE3(dofun,_stub_,id), 0, 0, 0 } };\
    static ret IGPROF_MERGE3(dofun,_stub_,id) (IGPROF_MERGE2(IGPROF_ARGS,n) args) \
      { return dofun (IGPROF_MERGE3(dofun,_hook,id).typed                       \
                      IGPROF_MERGE2(IGPROF_ARGSREST,n) argnames); }

#if IGPROF_DEBUG
# define IGPROF_ASSERT(expr) \
    ((void)((expr) ? 1 : IgProf::panic(__FILE__,__LINE__,__PRETTY_FUNCTION__,#expr)))
#else
# define IGPROF_ASSERT(expr)
#endif

// #define IGPROF_VERBOSE 1
#if IGPROF_VERBOSE
# define IGPROF_TRACE(expr) do { IgProf::debug expr; } while (0)
#else
# define IGPROF_TRACE(expr) do { ; } while (0)
#endif

#define IGPROF_RDTSC(v)                                   \
  do { unsigned lo, hi;                                   \
       __asm__ volatile ("rdtsc" : "=a" (lo), "=d" (hi)); \
       (v) = ((uint64_t) lo) | ((uint64_t) hi << 32);     \
  } while (0)

#endif // MACROS_H