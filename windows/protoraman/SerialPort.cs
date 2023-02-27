using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Windows.Storage.Streams;
using Windows.Devices.Enumeration;
using Microsoft.ReactNative;
using Microsoft.ReactNative.Managed;
using Windows.Devices.Usb;
using Windows.Devices.SerialCommunication;
using Windows.Foundation;
using System.Diagnostics;

namespace protoraman
{
    [ReactModule]
    class SerialPort
    {
        #region Atributtes
        private const string AQS = "System.ItemNameDisplay:=\"FT232R USB UART\" AND " +
            "System.Devices.InterfaceClassGuid:=\"{86e0d1e0-8089-11d0-9ce4-08003e301f73}\"" +
            "System.Devices.InterfaceEnabled:=System.StructuredQueryType.Boolean#True";
        private bool connecting = false;
        private SerialDevice device = null;
        #endregion

        #region Methods
        [ReactMethod("getDevices")]
        public async Task<JSValueObject> GetDevices()
        {
            TaskCompletionSource<JSValueObject> tcs = new TaskCompletionSource<JSValueObject>();

            var selector = SerialDevice.GetDeviceSelector("COM8");
            var devices = await DeviceInformation.FindAllAsync(selector);
            if (devices.Any()) //if the device is found
            {
                JSValueArray jsdevices = new JSValueArray();
                foreach (DeviceInformation device in devices)
                {
                    JSValueArray properties = new JSValueArray();
                    foreach (string property in device.Properties.Keys)
                    {
                        properties.Add(property);
                    }
                    JSValueObject data = new JSValueObject() { 
                        { "id", device.Id },
                        { "properties", properties }
                    };
                    if (device.Properties.ContainsKey("System.ItemNameDisplay"))
                    {
                        data["name"] = device.Properties["System.ItemNameDisplay"].ToString();
                    }
                    jsdevices.Add(data);
                }

                JSValueObject res = new JSValueObject() { { "devices", jsdevices } };
                tcs.SetResult(res);
            }
            else
            {
                tcs.SetResult(new JSValueObject());
            }

            var result = await tcs.Task;
            return result;
        }

        [ReactMethod("createWatcher")]
        public void CreateWatcher()
        {
            Debug.WriteLine("onDeviceAdded");
            TaskCompletionSource<JSValueObject> tcs = new TaskCompletionSource<JSValueObject>();

            var deviceWatcher = DeviceInformation.CreateWatcher(AQS);

            deviceWatcher.Added += new TypedEventHandler<DeviceWatcher, DeviceInformation>
                                    (this.OnDeviceAdded);

            deviceWatcher.EnumerationCompleted += new TypedEventHandler<DeviceWatcher, Object>
                                    (this.OnEnumerationCompleted);

            deviceWatcher.Removed += new TypedEventHandler<DeviceWatcher, DeviceInformationUpdate>
                                    (this.OnDeviceRemoved);

            deviceWatcher.Start();
        }

        private async void OnDeviceAdded(DeviceWatcher watcher, DeviceInformation deviceInfo)
        {
            if (this.device == null)
            {
                this.connecting = true;
                OnConnecting?.Invoke();
                try
                {
                    this.device = await SerialDevice.FromIdAsync(deviceInfo.Id);
                    if (this.device != null)
                    {
                        OnDeviceConnected?.Invoke();
                    }

                }
                catch (Exception exception)
                {
                    this.connecting = false;
                    OnConnectionFailed?.Invoke(exception.Message.ToString());
                    this.device = null;
                }
            }
        }

        private void OnEnumerationCompleted(DeviceWatcher watcher, Object obj)
        {
            if(this.device == null && !this.connecting)
            {
                OnInitialDeviceNotPlugged?.Invoke();
            }
        }

        private void OnDeviceRemoved(DeviceWatcher watcher, DeviceInformationUpdate deviceInfo)
        {
            this.device = null;
            OndeviceDisconnected?.Invoke();
        }

        private async void DeviceWrite()
        {
            this.device.BaudRate = 9600;
            this.device.DataBits = 8;
            this.device.StopBits = SerialStopBitCount.One;
            this.device.Parity = SerialParity.None;
            DataWriter dataWriter = new DataWriter(this.device.OutputStream);
            await dataWriter.StoreAsync();
            dataWriter.WriteString("1");
        }

        #endregion

        #region Events
        [ReactEvent("onConnecting")]
        public Action OnConnecting { get; set; }

        [ReactEvent("onDeviceConnected")]
        public Action OnDeviceConnected { get; set; }

        [ReactEvent("onDeviceDisconnected")]
        public Action OndeviceDisconnected { get; set; }

        [ReactEvent("onInitialDeviceNotPlugged")]
        public Action OnInitialDeviceNotPlugged { get; set; }

        [ReactEvent("onConnectionFailed")]
        public Action<string> OnConnectionFailed { get; set; }

        #endregion

    }
}
