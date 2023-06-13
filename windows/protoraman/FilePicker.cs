using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using Windows.Storage;
using Windows.Storage.Pickers;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;
using Windows.Storage.Provider;

namespace protoraman
{
    [ReactModule]
    class FilePicker
    {
        [ReactMethod("pickFile")]
        public async Task<StorageFile> PickFile(string suggestedName, IReadOnlyList<JSValue> extensionsList)
        {
            TaskCompletionSource<StorageFile> tcs = new TaskCompletionSource<StorageFile>();

            await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, async () => {
                var savePicker = new FileSavePicker();
                savePicker.SuggestedStartLocation = PickerLocationId.Downloads;
                savePicker.SuggestedFileName = suggestedName;
                foreach (var ext in extensionsList) {
                    savePicker.FileTypeChoices.Add(ext.AsString(), new List<string> { '.' + ext.AsString().ToLower() });
                }
                //savePicker.FileTypeChoices.Add("plain txt", new List<string> { ".txt" });
                StorageFile file = await savePicker.PickSaveFileAsync();
                tcs.SetResult(file);
            });

            var result = await tcs.Task;
            return result;
        }

        [ReactMethod("saveFile")]
        public async Task<StorageFile> SaveFile(string suggestedName, IList<JSValue> extensionsList)
        {
            TaskCompletionSource<StorageFile> tcs = new TaskCompletionSource<StorageFile>();

            await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, async () => {
                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Downloads;
                savePicker.SuggestedFileName = suggestedName;
                foreach (var ext in extensionsList)
                {
                    IReadOnlyDictionary<string, JSValue> extObject = ext.AsObject();
                    savePicker.FileTypeChoices.Add(extObject["name"].AsString(), new List<string> { extObject["extension"].AsString() });
                }
                StorageFile file = await savePicker.PickSaveFileAsync();
                if (file != null)
                {
                    CachedFileManager.DeferUpdates(file);
                    await FileIO.WriteTextAsync(file, file.Name);
                    var status = await CachedFileManager.CompleteUpdatesAsync(file);
                    //tcs.SetResult(status == FileUpdateStatus.Complete);
                    tcs.SetResult(file);
                }
                else
                {
                    tcs.SetResult(null);
                }
            });

            var result = await tcs.Task;
            return result;
        }
    }
}
