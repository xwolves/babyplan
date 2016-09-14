package com.finger.activity;

import com.theme.finger.print.Device;

import android.app.Application;

public class Gdata extends Application{
	private Device mDevice=null;

	public Device getmDevice() {
		return mDevice;
	}

	public void setmDevice(Device mDevice) {
		this.mDevice = mDevice;
	} 
}
