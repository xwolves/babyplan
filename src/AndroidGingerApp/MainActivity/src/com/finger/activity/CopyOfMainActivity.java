package com.finger.activity;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings.Secure;
import android.telephony.TelephonyManager;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.finger.utils.Utils;
import com.theme.finger.print.Device;
import com.theme.finger.print.Device.OnConnectionListener;
import com.theme.finger.print.Device.OnEnrollListener;
import com.theme.finger.print.Device.OnMatchExListener;
import com.theme.finger.print.Device.OnRecvBitmapListener;
import com.theme.finger.print.Device.OnRecvCharListener;
import com.theme.finger.print.Device.OnSaveCharListener;
import com.theme.finger.print.Device.OnVerifyListener;
import com.theme.finger.print.ErrorCode;

import java.io.File;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.ArrayList;
import java.util.List;

public class CopyOfMainActivity extends Activity implements OnClickListener {

	private final String TAG = "TestFingerPrint";
	
	//save char file name
	private final String CHAR_FILE_NAME = "char_data";
	
	//default uart param
	private final String DEFAULT_SERIALPORT_NAME = "/dev/ttySAC1";
	private final int DEFAULT_SERIALPORT_SPEED = 115200;
	
	//prefrence of tmp
	private final String PREFERENCE_ROOT_NAME = "_finger_print_preference";
	private final String PREFERENCE_MODE_NAME = "mode_index";
	private final String PREFERENCE_UART_NAME = "uart_index";
	private final String PREFERENCE_ID_NAME = "id_index";
	
	
	private TextView mBtnIdentify, mBtnVerify, mBtnEnroll;
	private TextView mBtnGetCount, mBtnRemove, mBtnRemoveAll;
	private TextView mBtnRecvBitmap, mBtnUpChar, mBtnCancel;
	private CheckBox mChkDeviceOffOn;
	private TextView mTxtEnrollCount;
	
	private TextView mTxtInfo;
	private ImageView mImageView;
	private int mBitmapHeight = 0;

	private Spinner mSpinnerModes;
	private ArrayAdapter<String> mAdapterModes;
	
	private Spinner mSpinnerUarts;
	private ArrayAdapter<String> mAdapterUarts;
	
	private Spinner mSpinnerIds;
	private IndexAdapter mIndexAdapter;
	
	private PowerManager.WakeLock mWakeLock = null;
	
	
//	ActivityManager am; 
//
//	ActivityManager.MemoryInfo memoryInfo; 
	//usb&uart
	private Device mDevice;
	
	
	public static String getCPUSerial() {   
        String str = "", strCPU = "", cpuAddress = "0000000000000000";    
        try {     
            //璇诲彇CPU淇℃伅     
            Process pp = Runtime.getRuntime().exec("cat /proc/cpuinfo");      
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());    
            LineNumberReader input = new LineNumberReader(ir);    
            //鏌ユ壘CPU搴忓垪鍙�  
            for (int i = 1; i < 100; i++) {   
                str = input.readLine();   
                if (str != null) {   
                    //鏌ユ壘鍒板簭鍒楀彿鎵�湪琛�  
                    if (str.indexOf("Serial") > -1) {   
                        //鎻愬彇搴忓垪鍙�  
                        strCPU = str.substring(str.indexOf(":") + 1,   
                        str.length());   
                        //鍘荤┖鏍�  
                        cpuAddress = strCPU.trim();   
                        break;   
                    }   
                } else {   
                    //鏂囦欢缁撳熬   
                    break;   
                }   
            }   
        } catch (Exception ex) {   
            //璧嬩簣榛樿鍊�  
            ex.printStackTrace();   
        }   
        return cpuAddress;   
   } 
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.activity_main);
		registerReceiver(mCmdActionReceiver, new IntentFilter(ACTION));
		initLayout();
		
//		TelephonyManager TelephonyMgr = (TelephonyManager)getSystemService(TELEPHONY_SERVICE); 
//		String imei = TelephonyMgr.getDeviceId(); 
//		if(imei==null)
//		{
//			  imei = Secure.getString(this.getContentResolver(), Secure.ANDROID_ID);
//		}
		
		//String imei = "35" + //we make this look like a valid IMEI 
		//Build.BOARD.length()%10+ Build.BRAND.length()%10 + Build.CPU_ABI.length()%10 + Build.DEVICE.length()%10 + Build.DISPLAY.length()%10 + Build.HOST.length()%10 + Build.ID.length()%10 + Build.MANUFACTURER.length()%10 + Build.MODEL.length()%10 + Build.PRODUCT.length()%10 + Build.TAGS.length()%10 + Build.TYPE.length()%10 + Build.USER.length()%10 ; //13 digits  
            // android pad
		
		//am=(ActivityManager) getSystemService(ACTIVITY_SERVICE); 

	   // memoryInfo=new ActivityManager.MemoryInfo(); 

		String imei = getCPUSerial();
     
        mTxtInfo.setText(imei);
        
	}
	
	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		setContentView(R.layout.activity_main);
		initLayout();
	}
	
	
	private void initLayout() {
		mBtnIdentify = (TextView)findViewById(R.id.id_btn_identify);
		mBtnIdentify.setOnClickListener(this);
		
//		mBtnVerify = (TextView)findViewById(R.id.id_btn_verify);
//		mBtnVerify.setOnClickListener(this);
//		
//		mBtnEnroll = (TextView)findViewById(R.id.id_btn_enroll);
//		mBtnEnroll.setOnClickListener(this);
//		
//		mBtnGetCount = (TextView)findViewById(R.id.id_btn_get_count);
//		mBtnGetCount.setOnClickListener(this);
//		
//		mBtnRemove = (TextView)findViewById(R.id.id_btn_remove);
//		mBtnRemove.setOnClickListener(this);
//		
//		mBtnRemoveAll = (TextView)findViewById(R.id.id_btn_remove_all);
//		mBtnRemoveAll.setOnClickListener(this);
//		
//		
//		mBtnUpChar = (TextView)findViewById(R.id.id_btn_up_char);
//		mBtnUpChar.setOnClickListener(this);
//		
//		mBtnRecvBitmap = (TextView)findViewById(R.id.id_btn_recv_bitmap);
//		mBtnRecvBitmap.setOnClickListener(this);
//		
		mBtnCancel = (TextView)findViewById(R.id.id_btn_cancel);
		mBtnCancel.setOnClickListener(this);
		
		mTxtInfo = (TextView)findViewById(R.id.id_txt_info);
		mTxtEnrollCount = (TextView)findViewById(R.id.id_txt_size);
		mTxtEnrollCount.setText("0/0");
		mImageView = (ImageView)findViewById(R.id.id_image_content);
		
		List<String> values =new ArrayList<String>();
		values.add(getString(R.string.string_mode_usb_value));
		values.add(getString(R.string.string_mode_uart_value));
		mSpinnerModes = (Spinner)findViewById(R.id.id_spinner_modes);
		mAdapterModes = new ArrayAdapter<String>(this, R.layout.layout_spinner_head, values);
		mAdapterModes.setDropDownViewResource(R.layout.layout_spinner_drop_down);
		mSpinnerModes.setAdapter(mAdapterModes);
		int index = getSharedPreferences(this).getInt(PREFERENCE_MODE_NAME, 0);
		mSpinnerModes.setSelection(index < values.size() ? index : 0);
		mSpinnerModes.setOnItemSelectedListener(mItemSelectedListener);
		
		mSpinnerUarts = (Spinner)findViewById(R.id.id_spinner_uarts);
		mAdapterUarts = new ArrayAdapter<String>(this, R.layout.layout_spinner_head, Device.getSerialPortNams());
		mAdapterUarts.setDropDownViewResource(R.layout.layout_spinner_drop_down);
		mSpinnerUarts.setAdapter(mAdapterUarts);
		index = getSharedPreferences(this).getInt(PREFERENCE_UART_NAME, 0);
		mSpinnerUarts.setSelection(index < mAdapterUarts.getCount() ? index : 0);
		mSpinnerUarts.setOnItemSelectedListener(mItemSelectedListener);
		
		mSpinnerIds = (Spinner)findViewById(R.id.id_spinner_ids);
		mSpinnerIds.setEnabled(false);
		mIndexAdapter = new IndexAdapter(this, R.layout.layout_spinner_head, android.R.id.text1, 1);
		mIndexAdapter.setDropDownViewResource(R.layout.layout_spinner_drop_down);
		mSpinnerIds.setAdapter(mIndexAdapter);
		//mSpinnerIds.setSelection(0);
		
		mChkDeviceOffOn = (CheckBox)findViewById(R.id.id_chk_offs);
		mChkDeviceOffOn.setOnClickListener(this);
		mChkDeviceOffOn.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				if (!isChecked) {
					destoryDevice();
					mImageView.setBackgroundResource(R.drawable.logo);
					mTxtInfo.setText(getString(R.string.app_name));
					mTxtEnrollCount.setText("0/0");
				}
			}
		});
	}
	
	
	private OnItemSelectedListener mItemSelectedListener = new OnItemSelectedListener () {
		@Override
		public void onItemSelected(AdapterView<?> parent, View view,
				int position, long id) {
			Editor editor = getSharedPreferences(CopyOfMainActivity.this).edit();
			if (parent == mSpinnerModes) {
				final int index = getSharedPreferences(CopyOfMainActivity.this).getInt(PREFERENCE_MODE_NAME, 0);
				if (index != position) {
					mChkDeviceOffOn.setChecked(false);
				}
				editor.putInt(PREFERENCE_MODE_NAME, position);
			} else if (parent == mSpinnerUarts) {
				editor.putInt(PREFERENCE_UART_NAME, position);
			} else if (parent == mSpinnerIds) {
				editor.putInt(PREFERENCE_ID_NAME, position);
			}
			editor.commit();
		}

		@Override
		public void onNothingSelected(AdapterView<?> parent) {
			
		}
		
	};

	@Override
    protected void onStart() {
        super.onStart();
        acquireWakeLock();
        
    }

    @Override
    protected void onStop() {
        super.onStop();
        releaseWakeLock();
    }

    @Override
	protected void onDestroy() {
		super.onDestroy();
		destoryDevice();
		unregisterReceiver(mCmdActionReceiver);
	}
	
	private void destoryDevice() {
		if (mDevice != null) {
			mDevice.destory();
			mDevice = null;
		}
	}

	private void openDevice () {
		 final int index = mSpinnerModes.getSelectedItemPosition();
		 if (mDevice != null) {
			final int type = mDevice.getDeviceType();
			if (index == 0 && type != Device.DEVICE_TYPE_USB
					|| index == 1 && type != Device.DEVICE_TYPE_UART) {
				destoryDevice();
			}
		 }
		 if (mDevice == null) {
			 if (index == 0) {
				 mDevice = new Device(this, Device.DEVICE_TYPE_USB);
			 } else {
				 final String uartName = mAdapterUarts.getItem(mSpinnerUarts.getSelectedItemPosition());
				 mDevice = new Device(this, uartName, DEFAULT_SERIALPORT_SPEED);
			 }
			 mDevice.open(mConnectionListener);
		 }
	}
	

	
	private OnConnectionListener mConnectionListener = new OnConnectionListener() {
		@Override
		public void onConnected() {
			Log.d(TAG, "device connected...");
			mBitmapHeight = mImageView.getHeight();
			mChkDeviceOffOn.setChecked(true);
			mTxtInfo.setText(getString(R.string.string_device_connection_success ));
			Toast.makeText(CopyOfMainActivity.this, getString(R.string.string_device_connection_success), Toast.LENGTH_LONG).show();
			final int max = mDevice.getMaxCount();
			final String conent = "" + mDevice.getCount() + "/" + max;
			mTxtEnrollCount.setText(conent);
			
			mIndexAdapter = new IndexAdapter(CopyOfMainActivity.this, R.layout.layout_spinner_head, android.R.id.text1, max);
			mIndexAdapter.setDropDownViewResource(R.layout.layout_spinner_drop_down);
			mSpinnerIds.setAdapter(mIndexAdapter);
			mSpinnerIds.setEnabled(true);
			mSpinnerIds.setOnItemSelectedListener(mItemSelectedListener);
			int index = getSharedPreferences(CopyOfMainActivity.this).getInt(PREFERENCE_ID_NAME, 0);
			mSpinnerIds.setSelection(index < mIndexAdapter.getCount() ? index : 0);
		}

		@Override
		public void onPermissionDenied() {
			Log.d(TAG, "device permission denied...");
			mChkDeviceOffOn.setChecked(false);
			mTxtInfo.setText(getString(R.string.string_device_permission_denied));
		}

		@Override
		public void onNotFound() {
			Log.d(TAG, "device not found...");
			mChkDeviceOffOn.setChecked(false);
			mTxtInfo.setText(getString(R.string.string_device_not_found));
		}

		@Override
		public void onDisConnected() {
			mChkDeviceOffOn.setChecked(false);
			Log.d(TAG, "device disconnected...");
			mTxtInfo.setText(getString(R.string.string_device_dis_connection));
		}
	};
	
	
	
	@Override
	public void onClick(View v) {
		 if (v == mChkDeviceOffOn) {
			 if (!mChkDeviceOffOn.isChecked()) {
				 destoryDevice();
			 } else {
				 openDevice();
			 }
		 } else if(v == mBtnGetCount && mDevice != null) {
			 final int count = mDevice.getCount();
			 final String conent = "" + count + "/" + mDevice.getMaxCount();
			 mTxtEnrollCount.setText(conent);
			 mTxtInfo.setText(getString(R.string.string_get_count_success, count));
		} else if (v == mBtnEnroll && mDevice != null) {
			mDevice.enroll(true, new OnEnrollListener() {
				@Override
				public void onEnrollStep(final int step, final int count, final boolean retry) {
					mTxtInfo.setText(getString(R.string.string_enrolling, step, count));
				}

				@Override
				public void onFailed(final int errorCode) {
					mTxtInfo.setText(getErrMessage(errorCode));
				}

				@Override
				public void onBitmapProgress(int percent, int current, int count) {
					mTxtInfo.setText(getString(R.string.string_recv_bimap_percent, percent));
				}
				
				@Override
				public void onBitmap(final Bitmap bitmap) {
					mImageView.setBackground(new BitmapDrawable(getScaleBitmap(bitmap)));
				}

				@Override
				public void onEnrollFinished(final int id) {
					mSpinnerIds.setSelection(id - 1);
					mTxtInfo.setText(getString(R.string.string_enroll_success, id));
					
					 final String conent = "" + mDevice.getCount() + "/" + mDevice.getMaxCount();
					 mTxtEnrollCount.setText(conent);
				}
			});
		} else if (v == mBtnIdentify && mDevice != null) {
			mDevice.identify(true, new OnVerifyListener() {
				private String result = "";
				@Override
				public void onFailed(int errorCode) {
				    result = getErrMessage(errorCode);
				    mTxtInfo.setText(result);
				    //mTxtInfo.setText(getErrMessage(errorCode));
				}

				@Override
				public void onBitmapProgress(int percent, int current, int count) {
					mTxtInfo.setText(getString(R.string.string_recv_bimap_percent, percent));
				}
				
				@Override
				public void onBitmap(Bitmap bitmap) {
					mImageView.setBackground(new BitmapDrawable(getScaleBitmap(bitmap)));
				}

				@Override
				public void onStartVerify(int index) {
					mTxtInfo.setText(result + " \n" + (getString(R.string.string_collect_start)));
				}

				@Override
				public void onEndVerify(int index) {
					mTxtInfo.setText(getString(R.string.string_collect_end));
				}

				@Override
				public void onVerifySuccess(int id, boolean updated, int useTime) {
					if (useTime > 100) {
						useTime -= 100;
					}
					if (id > 0) {
						result = getString(R.string.string_verify_success, id, useTime);
						mSpinnerIds.setSelection(id - 1);
					} else {
						result = getString(R.string.string_verify_failed, useTime);
					}
					mTxtInfo.setText(result);
				}
			});
		} else if (v == mBtnVerify && mDevice != null) {
			final int id = (Integer)mIndexAdapter.getItem(mSpinnerIds.getSelectedItemPosition());
			mDevice.verify(id, true, new OnVerifyListener() {
				@Override
				public void onFailed(int errorCode) {
					mTxtInfo.setText(getErrMessage(errorCode));
				}
				
				@Override
				public void onBitmapProgress(int percent, int current, int count) {
					mTxtInfo.setText(getString(R.string.string_recv_bimap_percent, percent));
				}
				
				@Override
				public void onBitmap(Bitmap bitmap) {
					mImageView.setBackground(new BitmapDrawable(getScaleBitmap(bitmap)));
				}

				@Override
				public void onStartVerify(int index) {
					mTxtInfo.setText(getString(R.string.string_collect_start));
				}

				@Override
				public void onEndVerify(int index) {
					mTxtInfo.setText(getString(R.string.string_collect_end));
				}

				@Override
				public void onVerifySuccess(int id, boolean updated, int useTime) {
					if (useTime > 100) {
						useTime -= 100;
					}
					if (id > 0) {
						mTxtInfo.setText(getString(R.string.string_verify_success, id, useTime));
						mSpinnerIds.setSelection(id - 1);
					} else {
						mTxtInfo.setText(getString(R.string.string_verify_failed, useTime));
					}
				}
			});
		} else if (v == mBtnRecvBitmap && mDevice != null) {
			mDevice.recvBitmap(new OnRecvBitmapListener() {
				@Override
				public void onFailed(int errorCode) {
					mTxtInfo.setText(getErrMessage(errorCode));
				}
				
				@Override
				public void onBitmapProgress(int percent, int current, int count) {
					mTxtInfo.setText(getString(R.string.string_recv_bimap_percent, percent));
				}
				
				@Override
				public void onBitmap(Bitmap bitmap) {
					mImageView.setBackground(new BitmapDrawable(getScaleBitmap(bitmap)));
					mTxtInfo.setText(getString(R.string.string_recv_bitmap_end));
				}

				@Override
				public void onStartRecv() {
					mTxtInfo.setText(getString(R.string.string_collect_start));
				}

				@Override
				public void onEndRecv() {
					mTxtInfo.setText(getString(R.string.string_recv_bitmap_end));
				}
			});
		} else if (v == mBtnUpChar && mDevice != null) {
			final int id = (Integer)mIndexAdapter.getItem(mSpinnerIds.getSelectedItemPosition());
			getChar(id);
		}else if (v == mBtnRemove && mDevice != null) {
			final int id = (Integer)mIndexAdapter.getItem(mSpinnerIds.getSelectedItemPosition());
			final boolean success = mDevice.removeId(id);
			if (success) {
				mTxtInfo.setText(getString(R.string.string_remove_id_success, id));
				 final String conent = "" + mDevice.getCount() + "/" + mDevice.getMaxCount();
				 mTxtEnrollCount.setText(conent);
			} else {
				mTxtInfo.setText(getString(R.string.string_remove_id_failed));
			}
		} else if (v == mBtnRemoveAll && mDevice != null) {
			final boolean success = mDevice.removeAll();
			if (success) {
				mTxtInfo.setText(getString(R.string.string_remove_all_id_success));
				 final String conent = "" + mDevice.getCount() + "/" + mDevice.getMaxCount();
				 mTxtEnrollCount.setText(conent);
			} else {
				mTxtInfo.setText(getString(R.string.string_remove_all_id_failed));
			}
		} else if (v == mBtnCancel && mDevice != null) {
			mDevice.cancel();
		}
	}
	
	/**
	 * 婢跺洨鏁ら崙鑺ユ殶閿涘矁骞忛崣鏍瀵颁礁锟�	 */
	private void getChar(final int id) {
		mDevice.getChar(id, new OnRecvCharListener(){

			@Override
			public void onFailed(int errorCode) {
				mTxtInfo.setText(getErrMessage(errorCode));
			}

			@Override
			public void onRecvChar(int id, byte[] chars) {
				//Log.d(TAG, "onRecvChar id = " + id + ", size = " + chars.length + ", file = " + new File(getCacheDir().getAbsolutePath(), CHAR_FILE_NAME).getAbsolutePath());
				mTxtInfo.setText(getString(R.string.string_get_char_success, id, new File(getCacheDir().getAbsolutePath(), CHAR_FILE_NAME).getAbsolutePath()));
				Utils.getFile(chars, getCacheDir().getAbsolutePath(), CHAR_FILE_NAME);
				mSpinnerIds.setSelection(id - 1);
			}
			
		});
	}
	
	/**
	 * 婢跺洨鏁ら崙鑺ユ殶閿涘奔绻氱�妯煎瀵颁礁锟�	 */
	private void setChar() {
		byte[] buf = Utils.getBytes(new File(getCacheDir().getAbsolutePath(), CHAR_FILE_NAME).getAbsolutePath());
		mDevice.setChar(buf, new OnSaveCharListener() {

			@Override
			public void onFailed(int errorCode) {
				mTxtInfo.setText(getErrMessage(errorCode));
			}

			@Override
			public void onSaveCharSuccess(int id) {
				mTxtInfo.setText(getString(R.string.string_set_char_success, id));
			}
			
		});
	}
	
	/**
	 * 婢跺洨鏁ら崙鑺ユ殶閿涘苯灏柊宥囧瀵颁礁锟�	 */
	private void match() {
		byte[] buffer = Utils.getBytes(new File(getCacheDir().getAbsolutePath(), CHAR_FILE_NAME).getAbsolutePath());
		mDevice.matchEx(1, buffer, true, new OnMatchExListener() {

			@Override
			public void onStartRecv() {
				Log.d(TAG, "onStartRecv");
				mTxtInfo.setText(getString(R.string.string_collect_start));
			}

			@Override
			public void onEndRecv() {
				Log.d(TAG, "onEndRecv");
				mTxtInfo.setText(getString(R.string.string_collect_end));
			}
			
			@Override
			public void onBitmapProgress(int percent, int current, int count) {
				mTxtInfo.setText(getString(R.string.string_recv_bimap_percent, percent));
			}
			
			@Override
			public void onBitmap(Bitmap bitmap) {
				mImageView.setBackground(new BitmapDrawable(getScaleBitmap(bitmap)));
			}

			@Override
			public void onFailed(int errorCode) {
				mTxtInfo.setText(getErrMessage(errorCode));
			}

			@Override
			public void onMatchSuccess(int id) {
				Log.d(TAG, "onMatchSuccess id = " + id);
				mTxtInfo.setText(getString(R.string.string_match_success, id));
			}
			
		});
	}
	
	
	private String getErrMessage(final int errorCode) {
		String result = "";
		switch(errorCode) {
		case ErrorCode.ERR_FAIL:
			result = getString(R.string.string_err_fail);
			break;
		case ErrorCode.ERR_CONNECTION:
			result = getString(R.string.string_err_connection);
			break;
		case ErrorCode.ERR_VERIFY:
			result = getString(R.string.string_err_verify);
			break;
		case ErrorCode.ERR_IDENTIFY:
			result = getString(R.string.string_err_identify);
			break;
		case ErrorCode.ERR_TMPL_EMPTY:
			result = getString(R.string.string_err_tmpl_empty);
			break;
		case ErrorCode.ERR_TMPL_NOT_EMPTY:
			result = getString(R.string.string_err_tmpl_not_empty);
			break;
		case ErrorCode.ERR_ALL_TMPL_EMPTY:
			result = getString(R.string.string_err_all_tmpl_empty);
			break;
		case ErrorCode.ERR_EMPTY_ID_NOEXIST:
			result = getString(R.string.string_err_tmpl_empty_no_exist);
			break;
		case ErrorCode.ERR_BROKEN_ID_NOEXIST:
			result = getString(R.string.string_err_tmpl_broken_no_exist);
			break;
		case ErrorCode.ERR_INVALID_TMPL_DATA:
			result = getString(R.string.string_err_tmp_invalid);
			break;
		case ErrorCode.ERR_DUPLICATION_ID:
			result = getString(R.string.string_err_tmp_duplication);
			break;
		case ErrorCode.ERR_BAD_QUALITY:
			result = getString(R.string.string_err_bad_qualy);
			break;
		case ErrorCode.ERR_MERGE_FAIL:
			result = getString(R.string.string_err_merge_failed);
			break;
		case ErrorCode.ERR_NOT_AUTHORIZED:
			result = getString(R.string.string_err_auth);
			break;
		case ErrorCode.ERR_MEMORY:
			result = getString(R.string.string_err_memory);
			break;
		case ErrorCode.ERR_INVALID_TMPL_NO:
			result = getString(R.string.string_err_invalid_tmpl_id);
			break;
		case ErrorCode.ERR_INVALID_PARAM:
			result = getString(R.string.string_err_invalid_param);
			break;
		case ErrorCode.ERR_TIME_OUT:
			result = getString(R.string.string_err_time_out);
			break;
		case ErrorCode.ERR_GEN_COUNT:
			result = getString(R.string.string_err_gen_count);
			break;
		case ErrorCode.ERR_INVALID_BUFFER_ID:
			result = getString(R.string.string_err_invalid_buffer_id);
			break;
		case ErrorCode.ERR_INVALID_OPERATION_MODE:
			result = getString(R.string.string_err_invalid_operation_mode);
			break;
		case ErrorCode.ERR_FP_NOT_DETECTED:
			result = getString(R.string.string_err_not_detectd);
			break;
		case ErrorCode.ERR_FP_CANCEL:
			result = getString(R.string.string_err_cancel);
			break;
			default:
				result = getString(R.string.string_err_unknow);	
		}
		return result + " " + getString(R.string.string_err_code_format, String.format("0x%02x", errorCode));
	}
	
	private SharedPreferences getSharedPreferences(Context context) {
		return context.getSharedPreferences(PREFERENCE_ROOT_NAME, Context.MODE_PRIVATE);
	}
	
	private Bitmap getScaleBitmap(Bitmap base) {
		final float scale = (float)mBitmapHeight / base.getHeight();
		final int width = (int)(base.getWidth() * scale);
		DisplayMetrics display = getResources().getDisplayMetrics();
		return Utils.scale(base, (int)(width * display.density), (int)(mBitmapHeight * display.density));
	}
	
    private void acquireWakeLock() {
        if (null == mWakeLock) {
            Log.e(TAG, "acquiring Wakelock");
            mWakeLock = ((PowerManager) getSystemService(Context.POWER_SERVICE))
                    .newWakeLock(PowerManager.FULL_WAKE_LOCK, "fp-demo");
            mWakeLock.acquire();
        }
    }

    private void releaseWakeLock() {
        if (null != mWakeLock && mWakeLock.isHeld()) {
            Log.e(TAG, "releaseWakeLock");
            mWakeLock.release();
            mWakeLock = null;
        }
    }
    
	
	private class IndexAdapter extends BaseAdapter {
		private int mCount = 0;
		private Context mContext;
		private int mDropDownResource;
		private int mResource;
		private int mFieldId = 0;
	    private LayoutInflater mInflater;
		
		public IndexAdapter(Context context, int resuource, int textViewResourceId, int count) {
			mContext = context;
			mResource = mDropDownResource = resuource;
			mFieldId = textViewResourceId;
			mInflater = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);;
			mCount = count;
		}

		@Override
		public int getCount() {
			return mCount;
		}

		@Override
		public Object getItem(int position) {
			return position + 1;
		}

		@Override
		public long getItemId(int position) {
			return position;
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			return createViewFromResource(position, convertView, parent, mResource);
		}
		
		/**
		 * <p>
		 * Sets the layout resource to create the drop down views.
		 * </p>
		 * @param resource
		 *            the layout resource defining the drop down views
		 * @see #getDropDownView(int, android.view.View, android.view.ViewGroup)
		 */
		public void setDropDownViewResource(int resource) {
			this.mDropDownResource = resource;
		}
		
		@Override
		public View getDropDownView(int position, View convertView, ViewGroup parent) {
			return createViewFromResource(position, convertView, parent, mDropDownResource);
		}

		private View createViewFromResource(int position, View convertView,
				ViewGroup parent, int resource) {
			View view;
			TextView text;

			if (convertView == null) {
				view = mInflater.inflate(resource, parent, false);
			} else {
				view = convertView;
			}

			try {
				if (mFieldId == 0) {
					// If no custom field is assigned, assume the whole resource
					// is a TextView
					text = (TextView) view;
				} else {
					// Otherwise, find the TextView field within the layout
					text = (TextView) view.findViewById(mFieldId);
				}
			} catch (ClassCastException e) {
				throw new IllegalStateException("IndexAdapter requires the resource ID to be a TextView",e);
			}
			Object item = getItem(position);
			if (item instanceof CharSequence) {
				text.setText((CharSequence) item);
			} else {
				text.setText(item.toString());
			}
			return view;
		}
	}
	/**
	 * 閻€劋绨拫鍐槸
	 * adb shell am start com.theme.finger.print.demo/com.theme.finger.print.demo.MainActivity
	 * adb shell am broadcast -a send_action_cmd --ei extra 1
	 */
	private final String ACTION = "send_action_cmd";
	private final String EXTRA_NAME = "extra";
	private BroadcastReceiver mCmdActionReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			final String action = intent.getAction();
			if (action.equals(ACTION)) {
				final int value = intent.getIntExtra(EXTRA_NAME, -1);
				switch(value) {
				case 1:
					 if (mDevice != null) {
						 destoryDevice();
					 } else {
						 openDevice();
					 }
					break;
				case 2:
					onClick(mBtnGetCount);
					break;
				case 5: //enroll
					onClick(mBtnEnroll);
					break;	
				case 6: //1:n
					onClick(mBtnIdentify);
					break;	
				case 7: //1:1
					onClick(mBtnVerify);
					break;	
				case 8: //remove
					onClick(mBtnRemove);
					break;	
				case 9: //remove all
					onClick(mBtnRemoveAll);
					break;	
				case 10: //recv bitmap
					onClick(mBtnRecvBitmap);
					break;	
				case 11: //cancel
					onClick(mBtnCancel);
					break;
				}
			}
		}
	};
}
