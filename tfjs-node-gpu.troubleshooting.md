# Troubleshooting CUDA related issues of @tensorflow/tfjs-node-gpu

Step 1: Add these to your `~/.bashrc` (source: mostafaelhoushi's answer from [here](https://github.com/tensorflow/tensorflow/issues/26182))

```console
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/lib/x86_64-linux-gnu/"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64/"
```

Step 2: Install CUDA 10.0

Step 3: Copy CUDA libraries from `/usr/local/cuda-10.0/lib64` to an arbitrary folder

Step 4: Completely remove CUDA 10.0 using uninstall script in `/usr/local/cuda-10.0/bin` folder

Step 5: Install CUDA 10.1

Step 6: Rename files (backup) or remove them completely
```console
cd /usr/local/cuda-10.1/lib64
mv ./libcudart.so ./_libcudart.so
mv ./libcudart.so.10.1 ./_libcudart.so.10.1
mv ./libcudart.so.10.1.105 ./_libcudart.so.10.1.105
mv ./libcudart_static.a ./_libcudart_static.a
mv ./libcusolver.so ./_libcusolver.so
mv ./libcusolver.so.10 ./_libcusolver.so.10
mv ./libcusolver.so.10.1.105 ./_libcusolver.so.10.1.105
mv ./libcusolver_static.a ./_libcusolver_static.a
```

Step 7: Copy following files from the arbitrary `cuda-10.0/lib64` folder to `/usr/local/cuda-10.1/lib64`
* `libcublas.so`
* `libcublas.so.10.0`
* `libcublas.so.10.0.103`
* `libcublas_static.a`
* `libcusolver.so`
* `libcusolver.so.10.0`
* `libcusolver.so.10.0.130`
* `libcusolver_static.a`
* `libcudart.so`
* `libcudart.so.10.0`
* `libcudart.so.10.0.130`
* `libcudart_static.a`

Step 8: If you haven't done it yet, install NVIDIA cuDNN for CUDA 10.1