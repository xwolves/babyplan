package com.finger.activity;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import com.finger.utils.Network;
import com.finger.utils.PostResult;
import com.finger.utils.Utils;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.app.Activity;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class Setting extends Activity implements OnClickListener {

	MsgHandler handler = new MsgHandler(this);

	TextView m_btnok;
	TextView m_btncancle;
	private TextView m_editDeviceid;
	private EditText m_editAccountID;
	private EditText m_editfdevice_status;
	private EditText m_editmaintainer_name;
	private EditText m_editmaintainer_phonenum;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_setting);
		init();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.setting, menu);
		return true;
	}

	private void init() {
		m_btnok = (TextView) findViewById(R.id.set_btn_ok);
		m_btnok.setOnClickListener(this);

		m_btncancle = (TextView) findViewById(R.id.set_btn_cancer);
		m_btncancle.setOnClickListener(this);

		m_editDeviceid = (TextView) findViewById(R.id.editDeviceid);
		m_editDeviceid.setText(Utils.getEthernetMacAddress());

		m_editAccountID = (EditText) findViewById(R.id.editAccountID);
		m_editfdevice_status = (EditText) findViewById(R.id.editfdevice_status);
		m_editmaintainer_name = (EditText) findViewById(R.id.editmaintainer_name);
		m_editmaintainer_phonenum = (EditText) findViewById(R.id.editmaintainer_phonenum);

		// new Thread() {
		// @Override
		// public void run() {
		// String uri = "device/setting/get";
		// JSONObject obj = new JSONObject();
		// try {
		// obj.put("deviceid", m_editDeviceid.getText().toString());
		// obj.put("depositid", m_editAccountID.getText().toString());
		// obj.put("status", Utils.getEthernetMacAddress());
		// } catch (JSONException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
		//
		// PostResult ret = Network.postdata(uri, obj);
		// // System.out.println("aa="+ret.toString());
		//
		// Message msg = new Message();
		// msg.what = 1;
		//
		// Bundle data = new Bundle();
		// data.putInt("errno", ret.getErrno());
		// data.putString("error", ret.getError());
		// msg.setData(data);
		// handler.sendMessage(msg);
		//
		// }
		// }.start();
	}

	// {
	// "deviceid":"xxx",
	// "signinid": 11000001,
	// "childid": 41000001,
	// "depositid":"fdasfafaaa"
	// }
	@Override
	public void onClick(View v) {
		if (v == m_btnok) {

			new Thread() {
				@Override
				public void run() {
					String uri = "device/setting/set";
					JSONObject obj = new JSONObject();
					try {
						obj.put("deviceid", m_editDeviceid.getText().toString());
						obj.put("depositid", m_editAccountID.getText()
								.toString());
						obj.put("status", Utils.getEthernetMacAddress());
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

					PostResult ret = Network.postdata(uri, obj);
					// System.out.println("aa="+ret.toString());

					Message msg = new Message();
					msg.what = 2;
					Bundle data = new Bundle();
					data.putInt("errno", ret.getErrno());
					data.putString("error", ret.getError());
					msg.setData(data);
					handler.sendMessage(msg);

				}
			}.start();

		} else if (v == m_btncancle) {
			this.finish();
		}

	}

	static class MsgHandler extends Handler {
		private WeakReference<Activity> mActivity;

		MsgHandler(Activity activity) {
			mActivity = new WeakReference<Activity>(activity);
		}

		@Override
		public void handleMessage(Message msg) {
			Setting activity = (Setting) mActivity.get();

			Bundle data = msg.getData();
			if (msg.what == 2) {
				int val = data.getInt("errno");
				if (activity != null) {
					if (val == 0) {
						Toast.makeText(activity, "设置成功", Toast.LENGTH_LONG)
								.show();
						activity.finish();
					} else {
						Toast.makeText(activity, data.getString("error"),
								Toast.LENGTH_LONG).show();
					}
					// Toast.makeText(activity, val, Toast.LENGTH_LONG).show();
					Log.i("mylog", "请求结果为-->" + val);
					// activity.identify();
				}
			}
			else if(msg.what == 1)
			{
				
			}

		}
	}

	// Handler handler = new Handler() {
	// @Override
	// public void handleMessage(Message msg) {
	// super.handleMessage(msg);
	// Bundle data = msg.getData();
	// String val = data.getString("value");
	// Log.i("mylog", "请求结果为-->" + val);
	// // TODO
	// // UI界面的更新等相关操作
	// }
	// };

	private void postInfotoServer() {
		m_editDeviceid.getText().toString();
		m_editAccountID.getText().toString();

	}

}
