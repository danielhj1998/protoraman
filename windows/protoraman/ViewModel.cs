using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;

namespace protoraman
{
    class ViewModel
    {
        public List<Point> Data { get; set; }

        public ViewModel(IReadOnlyList<JSValue> data)
        {
            Data = data.Select<JSValue, Point>(p => Selector(p)).ToList();
        }

        public ViewModel() {    }

        private Point Selector(JSValue pair)
        {
            var point = pair.AsArray();
            return new Point { X = point[0].AsDouble(), Y = point[1].AsDouble() };
        }
    }
}
