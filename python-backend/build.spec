# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller build spec for OpenScans Python Backend

Creates a standalone executable that bundles:
- Python runtime
- FastAPI server
- TotalSegmentator
- PyTorch CPU (no CUDA)

Target size: ~300-400MB
"""

import os
import sys
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# Collect all necessary packages
a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        # Include TotalSegmentator data files
        *collect_data_files('totalsegmentator'),
        # Include FastAPI templates
        *collect_data_files('fastapi'),
        # Include other config files
        ('config.py', '.'),
        ('model_manager.py', '.'),
        ('inference.py', '.'),
    ],
    hiddenimports=[
        # FastAPI and dependencies
        'fastapi',
        'uvicorn',
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'pydantic',
        'pydantic_core',
        'starlette',

        # TotalSegmentator and ML dependencies
        'totalsegmentator',
        'torch',
        'nibabel',
        'pydicom',
        'SimpleITK',
        'numpy',
        'scipy',
        'scikit-image',
        'scikit-learn',

        # nnU-Net and dependencies
        'nnunetv2',
        'batchgenerators',
        'dynamic_network_architectures',

        # Multiprocessing support
        'multiprocessing',
        'concurrent.futures',

        # Additional hidden imports
        *collect_submodules('uvicorn'),
        *collect_submodules('totalsegmentator'),
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # Exclude unnecessary libraries only
        # NOTE: Cannot exclude torch modules - PyTorch needs them internally (cuda, distributed, unittest, etc.)
        'torchvision.datasets',
        'matplotlib',
        'IPython',
        'jupyter',
        'notebook',
        'tkinter',
        'PyQt5',
        'PyQt6',
        'PySide2',
        'PySide6',

        # Exclude test modules (but keep unittest - PyTorch needs it)
        'pytest',
        'test',
        'tests',

        # Exclude documentation
        'sphinx',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

# Filter out unnecessary binaries
def filter_binaries(binaries):
    """Remove CUDA and other unnecessary binaries"""
    exclude_patterns = [
        'libcuda',
        'cudart',
        'cublas',
        'cudnn',
        'nccl',
        'cusparse',
        'cufft',
    ]

    filtered = []
    for binary in binaries:
        name = binary[0].lower()
        if not any(pattern in name for pattern in exclude_patterns):
            filtered.append(binary)

    return filtered

a.binaries = filter_binaries(a.binaries)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='openscans-inference',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,  # Enable UPX compression
    console=True,  # Show console for debugging
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='openscans-inference',
)
