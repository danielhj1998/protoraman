using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml;
using Windows.UI.Popups;
using Windows.UI.Xaml.Markup;
using Windows.UI.Xaml.Controls;
using Syncfusion.UI.Xaml.Charts;
using Windows.UI;
using System.Diagnostics;

namespace protoraman
{
    internal class ChartControlViewManager : AttributedViewManager<ChartControl>
    {
        private Int32 LastSmallTicksPerIntervalValue;

        [ViewManagerProperty("series")]
        public void SetSeries(ChartControl view, IList<JSValue> series)
        {
            if (null != series)
            {
                foreach(var s in series)
                {
                    IReadOnlyDictionary<string, JSValue> sObject = s.AsObject();
                    if (sObject.ContainsKey("data"))
                    {
                        FastLineSeries fls = new FastLineSeries();
                        var viewModel = new ViewModel(sObject["data"].AsArray());
                        fls.ItemsSource = viewModel.Data;
                        fls.XBindingPath = "X";
                        fls.YBindingPath = "Y";
                        view.Series.Add(fls);
                    }
                }
            }
            else
            {
                view.ClearValue(ChartControl.SeriesProperty);
            }
        }

        [ViewManagerProperty("backgroundColor")]
        public void SetAreaBackgroundColor(ChartControl view, Brush value)
        {
            if (null != value)
            {
                view.AreaBackground = value;
            }
            else
            {
                view.ClearValue(ChartControl.AreaBackgroundProperty);
            }
        }

        [ViewManagerProperty("borderColor")]
        public void SetAreaBorderColor(ChartControl view, Brush value)
        {
            if (null != value)
            {
                view.AreaBorderBrush = value;
            }
            else
            {
                view.ClearValue(ChartControl.AreaBorderBrushProperty);
            }
        }

        [ViewManagerProperty("borderWidth")]
        public void SetAreaBorderThickness(ChartControl view, double value)
        {
            if (value > 0)
            {
                view.AreaBorderThickness = new Thickness(value);
            }
            else
            {
                view.ClearValue(ChartControl.AreaBorderThicknessProperty);
            }
        }

        [ViewManagerProperty("range")]
        public void SetAxisRange(ChartControl view, IDictionary<string, JSValue> range)
        {
            if (range.Count > 0)
            {
                NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
                if (range["y"].AsArray() != null)
                {
                    yAxis.Minimum = range["y"][0].AsDouble();
                    yAxis.Maximum = range["y"][1].AsDouble();
                }
                else
                {
                    yAxis.ClearValue(NumericalAxis.MinimumProperty);
                    yAxis.ClearValue(NumericalAxis.MaximumProperty);
                }

                NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
                if (range["x"].AsArray() != null)
                {
                    xAxis.Minimum = range["x"][0].AsDouble();
                    xAxis.Maximum = range["x"][1].AsDouble();
                }
                else
                {
                    xAxis.ClearValue(NumericalAxis.MinimumProperty);
                    xAxis.ClearValue(NumericalAxis.MaximumProperty);
                }
            }
        }

        [ViewManagerProperty("intervals")]
        public void SetIntervals(ChartControl view, IDictionary<string, JSValue> intervals)
        {
            if (intervals.Count > 0)
            {
                NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
                if (intervals["y"].AsArray() != null)
                {
                    yAxis.Interval = intervals["y"].AsDouble();
                }
                else
                {
                    yAxis.ClearValue(NumericalAxis.IntervalProperty);
                }

                NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
                if (intervals["x"].AsArray() != null)
                {
                    xAxis.Interval = intervals["x"].AsDouble();
                }
                else
                {
                    xAxis.ClearValue(NumericalAxis.IntervalProperty);
                }
            }
        }

        [ViewManagerProperty("labelsStyle")]
        public void SetLabelsStyle(ChartControl view, IDictionary<string, JSValue> style)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
            if (style.ContainsKey("edgeLabelsDrawingMode"))
            {
                SetEdgeLabelsDrawingMode(xAxis, style["edgeLabelsDrawingMode"].AsString());
                SetEdgeLabelsDrawingMode(yAxis, style["edgeLabelsDrawingMode"].AsString());
            }
            xAxis.LabelStyle = new LabelStyle();
            yAxis.LabelStyle = new LabelStyle();
            if (style.ContainsKey("color"))
            {
                if (style["color"].AsString() != null)
                {
                    Color color = (Color)XamlBindingHelper.ConvertValue(typeof(Color), style["color"].AsString());
                    xAxis.LabelStyle.Foreground = new SolidColorBrush(color);
                    yAxis.LabelStyle.Foreground = new SolidColorBrush(color);
                }
            }
            if (style.ContainsKey("fontSize"))
            {
                if (style["fontSize"].AsDouble() > 0)
                {
                    double fontSize = style["fontSize"].AsDouble();
                    xAxis.LabelStyle.FontSize = fontSize;
                    yAxis.LabelStyle.FontSize = fontSize;
                }
            }
            if (style.ContainsKey("fontFamily"))
            {
                if (style["fontSize"].AsDouble() > 0)
                {
                    FontFamily fontFamily = new FontFamily(style["fontFamily"].AsString());
                    xAxis.LabelStyle.FontFamily = fontFamily;
                    yAxis.LabelStyle.FontFamily = fontFamily;
                }
            }
        }

        [ViewManagerProperty("axisStyle")]
        public void SetAxisStyle(ChartControl view, IDictionary<string, JSValue> style)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
            
            if (style.ContainsKey("tickLineSize"))
            {
                if (style["tickLineSize"].AsDouble() > 0)
                {
                    double tickLineSize = style["tickLineSize"].AsDouble();
                    xAxis.TickLineSize = tickLineSize;
                    yAxis.TickLineSize = tickLineSize;
                }
            }
        }

        [ViewManagerProperty("showGridLines")]
        public void EnableGridLines(ChartControl view, bool showGridLines)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
            xAxis.ShowGridLines = showGridLines;
            yAxis.ShowGridLines = showGridLines;
            if (showGridLines)
            {
                xAxis.SmallTicksPerInterval = this.LastSmallTicksPerIntervalValue;
                yAxis.SmallTicksPerInterval = this.LastSmallTicksPerIntervalValue;
            } else
            {
                this.LastSmallTicksPerIntervalValue = xAxis.SmallTicksPerInterval;
                xAxis.SmallTicksPerInterval = 0;
                yAxis.SmallTicksPerInterval = 0;
            }
        }

        [ViewManagerProperty("smallTicksPerInterval")]
        public void SetSmallTicksPerInterval(ChartControl view, Int32 number)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            NumericalAxis yAxis = (NumericalAxis)view.SecondaryAxis;
            xAxis.SmallTicksPerInterval = number;
            yAxis.SmallTicksPerInterval = number;
        }

        //[ViewManagerProperty("gridStyle")]
        //public void SetGridLinesStyle(ChartControl view, IDictionary<string, JSValue> style)
        //{

        //    NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
        //    xAxis.SmallTicksPerInterval = 2;
        //    Style s = new Style(typeof(LineStyle));
        //    Color color = (Color)XamlBindingHelper.ConvertValue(typeof(Color), style["color"].AsString());
        //    s.Setters.Add(new Setter(LineStyle.StrokeProperty, new SolidColorBrush(color)));
        //    s.Setters.Add(new Setter(LineStyle.StrokeThicknessProperty, style["strokeWidth"].AsDouble()));
        //    view.PrimaryAxis.MajorGridLineStyle = s;
        //}

        [ViewManagerProperty("xHeader")]
        public void SetXHeader(ChartControl view, string header)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            if (header != "")
            {
                xAxis.Header = header;
            }
        }

        private void SetEdgeLabelsDrawingMode(NumericalAxis axis, string mode)
        {
            switch (mode)
            {
                case "center":
                    axis.EdgeLabelsDrawingMode = EdgeLabelsDrawingMode.Center;
                    break;
                case "fit":
                    axis.EdgeLabelsDrawingMode = EdgeLabelsDrawingMode.Fit;
                    break;
                case "hide":
                    axis.EdgeLabelsDrawingMode = EdgeLabelsDrawingMode.Hide;
                    break;
                case "shift":
                    axis.EdgeLabelsDrawingMode = EdgeLabelsDrawingMode.Shift;
                    break;
                default:
                    axis.ClearValue(NumericalAxis.EdgeLabelsDrawingModeProperty);
                    break;
            }
        }
    }
}
