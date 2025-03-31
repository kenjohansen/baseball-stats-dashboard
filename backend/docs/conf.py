"""
Sphinx configuration for the Baseball Stats Dashboard backend documentation.
"""
import os
import sys
import datetime

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath('..'))

# Project information
project = 'Baseball Stats Dashboard API'
copyright = f'{datetime.datetime.now().year}, Ken Johansen'
author = 'Ken Johansen'
version = '1.0.0'
release = '1.0.0'

# Extensions
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'autoapi.extension',
]

# AutoAPI settings
autoapi_type = 'python'
autoapi_dirs = ['../app']
autoapi_options = [
    'members',
    'undoc-members',
    'private-members',
    'show-inheritance',
    'show-module-summary',
    'special-members',
]

# Napoleon settings
napoleon_google_docstring = True
napoleon_numpy_docstring = False
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = True

# HTML output settings
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_title = 'Baseball Stats Dashboard API'
html_logo = None
html_favicon = None

# Intersphinx mapping
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
    'fastapi': ('https://fastapi.tiangolo.com/', None),
}

# Other settings
templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
language = 'en'
