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
            ChartSelectionBehavior selection = new ChartSelectionBehavior()
            {
                EnableSeriesSelection = true,
                EnableSegmentSelection = false,
                SelectionCursor = Windows.UI.Core.CoreCursorType.Hand,
            };
            this.Behaviors.Add(selection);
            ChartZoomPanBehavior zooming = new ChartZoomPanBehavior()
            {
                EnableMouseWheelZooming = true,
                ZoomRelativeToCursor = true
            };
            this.Behaviors.Add(zooming);
            ChartTrackBallBehavior trackBallBehavior = new ChartTrackBallBehavior();
            this.Behaviors.Add(trackBallBehavior);
            this.PrimaryAxis.ShowTrackBallInfo = true;
            this.Legend = new ChartLegend();
        }

    }
}
