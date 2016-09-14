package com.finger.utils;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Matrix;

@SuppressLint("DefaultLocale")
public class Utils {

	/**
	 * 鏍规嵁byte鏁扮粍锛�?��鎴愭枃浠�?
	 */
	
	public static boolean isidentify= false;
	
	

//	public static boolean isCancel() {
//		return cancel;
//	}
//
//	public static void setCancel(boolean cancel) {
//		Utils.cancel = cancel;
//	}
	

	public static void getFile(byte[] buffer, String filePath, String fileName) {
		BufferedOutputStream bos = null;
		FileOutputStream fos = null;
		File file = null;
		try {
			File dir = new File(filePath);
			if (!dir.exists() && dir.isDirectory()) {// 鍒ゆ柇鏂囦欢鐩綍鏄惁瀛樺�?
														// dir.mkdirs();
			}
			file = new File(filePath, fileName);
			fos = new FileOutputStream(file);
			bos = new BufferedOutputStream(fos);
			bos.write(buffer);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
	}

	/**
	 * 鑾峰緱鎸囧畾鏂囦欢鐨刡yte鏁扮�?
	 */
	public static byte[] getBytes(String filePath) {
		byte[] buffer = null;
		try {
			File file = new File(filePath);
			FileInputStream fis = new FileInputStream(file);
			ByteArrayOutputStream bos = new ByteArrayOutputStream(1000);
			byte[] b = new byte[1000];
			int n;
			while ((n = fis.read(b)) != -1) {
				bos.write(b, 0, n);
			}
			fis.close();
			bos.close();
			buffer = bos.toByteArray();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return buffer;
	}

	/**
	 * 灏哹itmap缂╂斁鑷虫寚瀹氬ぇ灏�?* @param bitmap 鍘熷bitmap
	 * 
	 * @param new_width
	 *            鐩爣�?藉害
	 * @param new_height
	 *            鐩爣楂樺害
	 * @return杩斿洖缂╂斁鍚庣殑bitmap
	 */
	public static Bitmap scale(Bitmap bitmap, int new_width, int new_height) {
		if (bitmap == null || bitmap.isRecycled())
			return bitmap;
		final int width = bitmap.getWidth();
		final int height = bitmap.getHeight();

		if (width != new_width || height != new_height) {
			final float scale_width = (float) new_width / width;
			final float scale_height = (float) new_height / height;

			Matrix matrix = new Matrix();
			matrix.postScale(scale_width, scale_height);
			return Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix,
					true);
		} else {
			return bitmap;
		}
	}

	public static String execCommand(String command) throws IOException {
		// start the ls command running
		// String[] args = new String[]{"sh", "-c", command};
		Runtime runtime = Runtime.getRuntime();
		Process proc = runtime.exec(command); //
		InputStream inputstream = proc.getInputStream();
		InputStreamReader inputstreamreader = new InputStreamReader(inputstream);
		BufferedReader bufferedreader = new BufferedReader(inputstreamreader);
		// read the ls output
		String line = "";
		StringBuilder sb = new StringBuilder(line);
		while ((line = bufferedreader.readLine()) != null) {
			// System.out.println(line);
			sb.append(line);
		}
		// tv.setText(sb.toString());
		// 使用exec执行不会等执行成功以后才返回,它会立即返回
		// �?��在某些情况下是很要命�?比如复制文件的时�?
		// 使用wairFor()可以等待命令执行完成以后才返�? try {
		try {
			if (proc.waitFor() != 0) {
				System.err.println("exit value = " + proc.exitValue());
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return sb.toString();
	}

	// return sb.toString();

	protected static InetAddress getLocalInetAddress() {
		InetAddress ip = null;
		try {
			Enumeration<NetworkInterface> en_netInterface = NetworkInterface
					.getNetworkInterfaces();
			while (en_netInterface.hasMoreElements()) {
				NetworkInterface ni = (NetworkInterface) en_netInterface
						.nextElement();
				Enumeration<InetAddress> en_ip = ni.getInetAddresses();
				while (en_ip.hasMoreElements()) {
					ip = en_ip.nextElement();
					if (!ip.isLoopbackAddress()
							&& ip.getHostAddress().indexOf(":") == -1)
						break;
					else
						ip = null;
				}

				if (ip != null) {
					break;
				}
			}
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ip;
	}

	@SuppressLint("DefaultLocale")
	public static String getEthernetMacAddress() {
		String strMacAddr = null;
		try {
			InetAddress ip = getLocalInetAddress();

			byte[] b = NetworkInterface.getByInetAddress(ip)
					.getHardwareAddress();
			StringBuffer buffer = new StringBuffer();
			for (int i = 0; i < b.length; i++) {
				if (i != 0) {
					buffer.append('-');
				}

				String str = Integer.toHexString(b[i] & 0xFF);
				buffer.append(str.length() == 1 ? 0 + str : str);
			}
			strMacAddr = buffer.toString().toUpperCase();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return strMacAddr;
	}
}
