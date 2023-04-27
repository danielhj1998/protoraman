using System;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using Windows.Storage.Streams;
using Windows.Devices.Enumeration;
using Microsoft.ReactNative;
using Microsoft.ReactNative.Managed;
using Windows.Devices.Usb;
using Windows.Devices.SerialCommunication;
using Windows.Foundation;
using System.Text;
using System.Runtime.InteropServices.WindowsRuntime;

namespace protoraman
{
    [ReactModule]
    class SerialPort
    {
        #region Atributtes
        private const string AQS = "System.ItemNameDisplay:=\"FT232R USB UART\" AND " +
        //private const string AQS = "System.ItemNameDisplay:=\"STM32 STLink\" AND " +
            "System.Devices.InterfaceClassGuid:=\"{86e0d1e0-8089-11d0-9ce4-08003e301f73}\"" +
            "System.Devices.InterfaceEnabled:=System.StructuredQueryType.Boolean#True";
        private bool connecting = false;
        private SerialDevice device = null;
        private DeviceWatcher watcher;
        //[ReactConstant]
        //public JSValueObject watcherStatus = new JSValueObject() {
        //                { "Aborted", (int)DeviceWatcherStatus.Aborted },
        //                { "Created", (int)DeviceWatcherStatus.Created },
        //                { "Completed", (int)DeviceWatcherStatus.EnumerationCompleted },
        //                { "Started", (int)DeviceWatcherStatus.Started },
        //                { "Stopped", (int)DeviceWatcherStatus.Stopped },
        //                { "Stopping", (int)DeviceWatcherStatus.Stopping }
        //            };
        #endregion

        #region Methods
        [ReactMethod("getDevices")]
        public async Task<JSValueObject> GetDevices()
        {
            TaskCompletionSource<JSValueObject> tcs = new TaskCompletionSource<JSValueObject>();

            var selector = SerialDevice.GetDeviceSelector(AQS);
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
                    if (device.Properties.ContainsKey("System.Devices.InterfaceEnabled"))
                    {
                        data["enabled"] = (bool)device.Properties["System.Devices.InterfaceEnabled"];
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
            this.watcher = DeviceInformation.CreateWatcher(AQS);

            this.watcher.Added += new TypedEventHandler<DeviceWatcher, DeviceInformation>
                                    (this.OnDeviceAdded);

            this.watcher.EnumerationCompleted += new TypedEventHandler<DeviceWatcher, Object>
                                    (this.OnEnumerationCompleted);

            this.watcher.Removed += new TypedEventHandler<DeviceWatcher, DeviceInformationUpdate>
                                    (this.OnDeviceRemoved);

            this.watcher.Start();
        }

        [ReactMethod("getWatcherStatus")]
        public async Task<string> GetWatcherStatus()
        {
            var tcs = new TaskCompletionSource<string>();
            tcs.SetResult(this.watcher.Status.ToString());

            return await tcs.Task;
        }

        [ReactMethod("startWatcher")]
        public void StartWatcher()
        {
            this.watcher.Start();
        }

        [ReactMethod("stopWatcher")]
        public void StopWatcher()
        {
            this.watcher.Stop();
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
                        SetDeviceConfiguration(this.device);
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
            this.DeviceDispose();
            OnDeviceDisconnected?.Invoke();
        }


        [ReactMethod("deviceDispose")]
        public void DeviceDispose()
        {
            this.device.Dispose();
            this.device = null;
        }

        private void SetDeviceConfiguration(SerialDevice device)
        {
            device.BaudRate = 115200;
            device.DataBits = 8;
            device.StopBits = SerialStopBitCount.One;
            device.Parity = SerialParity.None;
            device.Handshake = SerialHandshake.None;
            device.ReadTimeout = System.TimeSpan.FromMilliseconds(1000);
        }

        [ReactMethod("deviceWriteString")]
        public async Task<bool> DeviceWriteString(string message)
        {
            var bytesToWrite = Encoding.ASCII.GetBytes(message).ToArray();
            return await this.DeviceWrite(bytesToWrite);
        }

        [ReactMethod("deviceWriteUint16")]
        public async Task<bool> DeviceWriteUInt16(UInt16 number)
        {
            return await this.DeviceWrite(BitConverter.GetBytes(number));
        }

        private async Task<bool> DeviceWrite(byte[] bytesToWrite)
        {
            TaskCompletionSource<bool> tcs = new TaskCompletionSource<bool>();
            try
            {
                await this.device.OutputStream.WriteAsync(bytesToWrite.AsBuffer());
                tcs.SetResult(true);
            }
            catch (Exception exception)
            {
                tcs.SetException(exception);
            }
            var result = await tcs.Task;
            return result;
        }

        [ReactMethod("deviceReadUInt16")]
        public async Task<UInt16> DeviceReadUInt16()
        {
            TaskCompletionSource<UInt16> tcs = new TaskCompletionSource<UInt16>();
            try
            {
                var inputStream = this.device.InputStream;
                var dataReader = new DataReader(inputStream)
                {
                    InputStreamOptions = InputStreamOptions.Partial,
                    ByteOrder = ByteOrder.LittleEndian
                };
                CancellationTokenSource cts = new CancellationTokenSource();
                cts.CancelAfter(10000);
                var bytesRead = await dataReader.LoadAsync(sizeof(UInt16)).AsTask(cts.Token);
                tcs.SetResult(dataReader.ReadUInt16());
                dataReader.DetachStream();
                dataReader.Dispose();
            }
            catch (Exception exception)
            {
                tcs.SetException(exception);
            }
            var result = await tcs.Task;
            return result;
        }

        [ReactMethod("deviceReadString")]
        public async Task<string> DeviceReadString(uint stringLength)
        {
            TaskCompletionSource<string> tcs = new TaskCompletionSource<string>();
            try
            {
                var inputStream = this.device.InputStream;
                var dataReader = new DataReader(inputStream)
                {
                    InputStreamOptions = InputStreamOptions.Partial,
                    ByteOrder = ByteOrder.LittleEndian
                };
                CancellationTokenSource cts = new CancellationTokenSource();
                cts.CancelAfter(10000);
                var bytesRead = await dataReader.LoadAsync(stringLength).AsTask(cts.Token);
                char[] chars = new char[stringLength];
                for(int i=0; i<stringLength; i++)
                {
                    chars[i] = Convert.ToChar(dataReader.ReadByte());
                }
                tcs.SetResult(new string(chars));
                dataReader.DetachStream();
                dataReader.Dispose();
            }
            catch (Exception exception)
            {
                tcs.SetException(exception);                
            }
            var result = await tcs.Task;
            return result;
        }

        [ReactMethod("deviceReadUInt16Array")]
        public async Task<JSValue> DeviceReadUInt16Array(uint arrayLength)
        {
            TaskCompletionSource<JSValue> tcs = new TaskCompletionSource<JSValue>();
            try
            {
                var inputStream = this.device.InputStream;
                var dataReader = new DataReader(inputStream)
                {
                    InputStreamOptions = InputStreamOptions.Partial,
                    ByteOrder = ByteOrder.LittleEndian
                };
                CancellationTokenSource cts = new CancellationTokenSource();
                cts.CancelAfter(10000);
                JSValueArray data = new JSValueArray();
                uint unloadedBufferLength = arrayLength * sizeof(UInt16);
                while (unloadedBufferLength > 0)
                {
                    if (unloadedBufferLength > 1000)
                    {
                        var bytesRead = await dataReader.LoadAsync(1000).AsTask(cts.Token);
                    }
                    else
                    {
                        var bytesRead = await dataReader.LoadAsync(unloadedBufferLength).AsTask(cts.Token);
                    }
                    unloadedBufferLength -= dataReader.UnconsumedBufferLength;
                    while (dataReader.UnconsumedBufferLength > 0)
                    {
                        data.Add(dataReader.ReadUInt16());
                    }
                }
                tcs.SetResult(data);
                dataReader.DetachStream();
                dataReader.Dispose();
            }
            catch (Exception exception)
            {
                tcs.SetException(exception);
            }
            var result = await tcs.Task;
            return result;
        }

        #endregion

        #region Events
        [ReactEvent("onConnecting")]
        public Action OnConnecting { get; set; }

        [ReactEvent("onDeviceConnected")]
        public Action OnDeviceConnected { get; set; }

        [ReactEvent("onDeviceDisconnected")]
        public Action OnDeviceDisconnected { get; set; }

        [ReactEvent("onInitialDeviceNotPlugged")]
        public Action OnInitialDeviceNotPlugged { get; set; }

        [ReactEvent("onConnectionFailed")]
        public Action<string> OnConnectionFailed { get; set; }

        [ReactEvent("onDataRead")]
        public Action<string> OnDataRead { get; set; }

        #endregion

    }
}
