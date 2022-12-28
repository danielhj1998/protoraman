using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Enumeration;
using Microsoft.ReactNative.Managed;
using Windows.Devices.SerialCommunication;

namespace protoraman
{
    [ReactModule]
    class SerialPort
    {
        [ReactMethod("getDevices")]
        public async Task<JSValueObject> GetDevices(string deviceSelector)
        {
            TaskCompletionSource<JSValueObject> tcs = new TaskCompletionSource<JSValueObject>();

            var selector = SerialDevice.GetDeviceSelector(deviceSelector);
            var devices = await DeviceInformation.FindAllAsync();
            if (devices.Any()) //if the device is found
            {
                JSValueArray ids = new JSValueArray();
                foreach (DeviceInformation device in devices)
                {
                    ids.Add(device.Id);
                }

                JSValueObject obj = new JSValueObject
                {
                    { "devices", ids }
                };

                tcs.SetResult(obj);
            }

            var result = await tcs.Task;
            return result;
        }
    }
}
