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
            ChartZoomPanBehavior zooming = new ChartZoomPanBehavior()
            {
                EnableMouseWheelZooming = true,
                ZoomRelativeToCursor = true
            };
            ChartSelectionBehavior selection = new ChartSelectionBehavior()
            {
                SelectionMode = Syncfusion.UI.Xaml.Charts.SelectionMode.MouseClick,
                EnableSeriesSelection = true
            };
            this.Behaviors.Add(zooming);
            this.Behaviors.Add(selection);
            this.PrimaryAxis.ShowTrackBallInfo = true;
            this.Legend = new ChartLegend();
        }

    }
}
