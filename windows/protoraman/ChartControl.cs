using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Syncfusion.UI.Xaml.Charts;
using Microsoft.ReactNative.Managed;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace protoraman
{
    public sealed class ChartControl : SfChart
    {
        public ChartControl()
        {
            this.PrimaryAxis = new NumericalAxis();
            this.SecondaryAxis = new NumericalAxis();
            ChartTrackBallBehavior trackBallBehavior = new ChartTrackBallBehavior();
            this.Behaviors.Add(trackBallBehavior);
            this.PrimaryAxis.ShowTrackBallInfo = true;
        }
    }
}
