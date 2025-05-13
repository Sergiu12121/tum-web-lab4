from setuptools import setup, find_packages

setup(
    name='lab_5',
    version='0.1',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[],
    entry_points={
        'console_scripts': [
            'lab5=cli:main',
        ],
    },
    author='Your Name',
    author_email='your.email@example.com',
    description='A minimal command-line tool for fetching web pages or search terms using raw sockets.',
    url='https://github.com/yourusername/lab_5',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)