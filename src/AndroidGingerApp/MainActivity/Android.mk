LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)

MY_PATH := $(LOCAL_PATH)

LOCAL_MODULE_TAGS := optional

								
LOCAL_SRC_FILES := $(call all-java-files-under,src)

LOCAL_PACKAGE_NAME := FPDemo

LOCAL_CERTIFICATE := platform

LOCAL_JNI_SHARED_LIBRARIES :=	libserial_port

LOCAL_PROGUARD_ENABLED := full
LOCAL_PROGUARD_FLAG_FILES := proguard-project.txt

LOCAL_STATIC_JAVA_LIBRARIES += thm-fingerprint-sdk

include $(BUILD_PACKAGE)
