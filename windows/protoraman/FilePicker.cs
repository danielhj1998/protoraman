using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using Windows.Storage;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace protoraman
{
    [ReactModule]
    class FilePicker
    {
        [ReactMethod("pickDirectory")]
        public async Task<JSValueObject> PickDirectory()
        {
            TaskCompletionSource<JSValueObject> tcs = new TaskCompletionSource<JSValueObject>();

            await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, async () => {
                var folderPicker = new Windows.Storage.Pickers.FolderPicker();
                folderPicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Desktop;
                folderPicker.FileTypeFilter.Add("*");
                Windows.Storage.StorageFolder folder = await folderPicker.PickSingleFolderAsync();
                if (folder != null)
                {
                    // Application now has read/write access to all contents in the picked folder
                    // (including other sub-folder contents)
                    Windows.Storage.AccessCache.StorageApplicationPermissions.
                    FutureAccessList.AddOrReplace("PickedFolderToken", folder);

                    JSValueObject obj = new JSValueObject
                    {
                        { "uri", folder.Path }
                    };

                    tcs.SetResult(obj);
                }
                else
                {
                    tcs.SetResult(new JSValueObject());
                }
            });

            var result = await tcs.Task;
            return result;
        }
    }
}
