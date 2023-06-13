using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using MathNet.Numerics.LinearAlgebra;

namespace protoraman
{
    [ReactModule]
    class Math
    {
        [ReactMethod("baselineALS")]
        public async Task<IList<int>> BaselineALS(IReadOnlyList<double> y, int lambda, int p, int niter = 100)
        {
            TaskCompletionSource<IList<int>> tcs = new TaskCompletionSource<IList<int>>();

            var L = y.Count;
            var M = Matrix<double>.Build;
            M.SparseOfDiagonalArray(y.ToArray<double>());

            var result = await tcs.Task;
            return result;
        }
    }
}
