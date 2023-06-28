using System;
using System.Collections.Generic;
using System.Reflection;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml;
using Windows.UI.Popups;
using Windows.UI.Xaml.Markup;
using Windows.UI.Xaml.Shapes;
using Syncfusion.UI.Xaml.Charts;
using Windows.UI;
using System.Diagnostics;
using Windows.Storage;
using Windows.Storage.Provider;
using Windows.Graphics.Imaging;

namespace protoraman
{
    internal class ChartControlViewManager : AttributedViewManager<ChartControl>
    {
        private Int32 LastSmallTicksPerIntervalValue;

        #region Properties

        [ViewManagerProperty("series")]
        public void SetSeries(ChartControl view, IList<JSValue> series)
        {
            if (null != series)
            {
                view.Series = new ChartSeriesCollection();
                foreach (var s in series)
                {
                    IReadOnlyDictionary<string, JSValue> sObject = s.AsObject();
                    if (sObject.ContainsKey("data"))
                    {
                        FastLineSeries fls = new FastLineSeries();
                        var viewModel = new ViewModel(sObject["data"].AsArray());
                        fls.ItemsSource = viewModel.Data;
                        fls.XBindingPath = "X";
                        fls.YBindingPath = "Y";

                        if (sObject.ContainsKey("color"))
                        {
                            Color color = (Color)XamlBindingHelper.ConvertValue(typeof(Color), sObject["color"].AsString());
                            fls.Interior = new SolidColorBrush(color);
                        }

                        Color selectionColor = (Color)XamlBindingHelper.ConvertValue(typeof(Color), "#3399ff");
                        fls.SeriesSelectionBrush = new SolidColorBrush(selectionColor);

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
                view.Background = value;
            }
            else
            {
                view.ClearValue(ChartControl.AreaBackgroundProperty);
                view.ClearValue(ChartControl.BackgroundProperty);
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

        [ViewManagerProperty("zoomMode")]
        public void SetZoomMode(ChartControl view, string mode)
        {
            var zooming = (ChartZoomPanBehavior)view.Behaviors[1];
            switch (mode) {
                case "xy":
                    zooming.EnableSelectionZooming = true;
                    break;
                case "x":
                    zooming.EnableSelectionZooming = true;
                    zooming.ZoomMode = ZoomMode.X;
                    break;
                case "y":
                    zooming.EnableSelectionZooming = true;
                    zooming.ZoomMode = ZoomMode.Y;
                    break;
                default:
                    zooming.EnableSelectionZooming = false;
                    zooming.ZoomMode = ZoomMode.XY;
                    break;
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
            this.LastSmallTicksPerIntervalValue = number;
            xAxis.SmallTicksPerInterval = number;
            yAxis.SmallTicksPerInterval = number;
        }

        [ViewManagerProperty("gridStyle")]
        public void SetGridLinesStyle(ChartControl view, IDictionary<string, JSValue> style)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            xAxis.SmallTicksPerInterval = 2;
            Style s = new Style(typeof(Line));
            if (style.ContainsKey("color"))
            {
                Color color = (Color)XamlBindingHelper.ConvertValue(typeof(Color), style["color"].AsString());
                s.Setters.Add(new Setter(Line.StrokeProperty, new SolidColorBrush(color)));
            }
            if (style.ContainsKey("strokeWidth"))
                s.Setters.Add(new Setter(Line.StrokeThicknessProperty, style["strokeWidth"].AsDouble()));

            view.PrimaryAxis.MajorGridLineStyle = s;
            view.PrimaryAxis.MinorGridLineStyle = s;
            view.SecondaryAxis.MajorGridLineStyle = s;
            view.SecondaryAxis.MinorGridLineStyle = s;
        }

        [ViewManagerProperty("xHeader")]
        public void SetXHeader(ChartControl view, string header)
        {
            NumericalAxis xAxis = (NumericalAxis)view.PrimaryAxis;
            if (header != "")
            {
                xAxis.Header = header;
            }
        }


        #endregion

        #region commands
        [ViewManagerCommand]
        public async Task<bool> SaveChart(ChartControl view, IReadOnlyList<JSValue> commandArgs)
        {
            TaskCompletionSource<bool> tcs = new TaskCompletionSource<bool>();

            string suggestedName = commandArgs[0].AsString();
            IReadOnlyList<JSValue> extensions = commandArgs[1].AsArray();
            var file = await new FilePicker().PickFile(suggestedName, extensions);
            Guid encoder = BitmapEncoder.JpegEncoderId;
            switch (file.FileType) {
                case ".jpg":
                    encoder = BitmapEncoder.JpegEncoderId;
                    break;
                case ".tiff":
                    encoder = BitmapEncoder.TiffEncoderId;
                    break;
                case ".png":
                    encoder = BitmapEncoder.PngEncoderId;
                    break;
                case ".bmp":
                    encoder = BitmapEncoder.BmpEncoderId;
                    break;
                default:
                    break;
            }
            CachedFileManager.DeferUpdates(file);
            view.Save(await file.OpenAsync(FileAccessMode.ReadWrite), encoder);
            var status = await CachedFileManager.CompleteUpdatesAsync(file);
            tcs.SetResult(status == FileUpdateStatus.Complete);

            var result = await tcs.Task;
            return result;
        }

        [ViewManagerCommand]
        public async Task<bool> SaveSeries(ChartControl view, IReadOnlyList<JSValue> commandArgs)
        {
            TaskCompletionSource<bool> tcs = new TaskCompletionSource<bool>();

            string suggestedName = commandArgs[0].AsString();
            IReadOnlyList<JSValue> extensions = commandArgs[1].AsArray();
            var file = await new FilePicker().PickFile(suggestedName, extensions);
            CachedFileManager.DeferUpdates(file);
            string fileContent = "";
            switch (file.FileType) {
                case ".csv":
                    fileContent = SeriesToSeparator(view.Series, ",");
                    break;
                case ".txt":
                    fileContent = SeriesToSeparator(view.Series, " ");
                    break;
                default:
                    break;
            }
            await FileIO.WriteTextAsync(file, fileContent);
            var status = await CachedFileManager.CompleteUpdatesAsync(file);
            tcs.SetResult(status == FileUpdateStatus.Complete);

            var result = await tcs.Task;
            return result;
        }
        #endregion

        private string SeriesToSeparator(ChartSeriesCollection seriesList, string separator)
        {
            var csv = new StringBuilder();
            var first = (List<Point>)seriesList[0].ItemsSource;
            for(int i = 0; i < first.Count; i++)
            {
                string newline = "" + first[i].X;
                foreach(var series in seriesList)
                {
                    var points = (List<Point>)series.ItemsSource;
                    newline += separator + points[i].Y;
                }
                csv.AppendLine(newline);
            }
            return csv.ToString();
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
