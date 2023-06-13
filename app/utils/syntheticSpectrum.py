#! /usr/bin/env python3

# https://towardsdatascience.com/data-science-for-raman-spectroscopy-a-practical-example-e81c56cf25f

import numpy as np
import matplotlib.pyplot as plt
from scipy import sparse
from scipy.sparse.linalg import spsolve
from scipy.signal import savgol_filter, general_gaussian

def Gauss(x, mu, sigma, A = 1):
    # This def returns the Gaussian function of x
    # x is an array
    # mu is the expected value
    # sigma is the square root of the variance
    # A is a multiplication factor
    
    gaussian = A/(sigma * np.sqrt(2*np.pi)) * np.exp(-0.5*((x-mu)/sigma)**2)
    
    return gaussian

# X-axis (Wavelengths)
x_range =  np.linspace(300, 2500, 3694)

# Let's create three different components

# Component A
mu_a1 = 350
sigma_a1 = 10
intensity_a1 = 2

mu_a2 = 780
sigma_a2 = 50
intensity_a2 = 1

mu_a3 = 2000
sigma_a3 = 20
intensity_a3 = 0.3

gauss_a =  Gauss(x_range, mu_a1, sigma_a1, intensity_a1) + Gauss(x_range, mu_a2, sigma_a2, intensity_a2) + Gauss(x_range, mu_a3, sigma_a3, intensity_a3)

# Component B
mu_b = 451
sigma_b = 30
intensity_b = 3

mu_b1 = 545
sigma_b1 = 25
intensity_b1 = 5

mu_b2 = 900
sigma_b2 = 10
intensity_b2 = 2

mu_b3 = 910
sigma_b3 = 1.5
intensity_b3 = 0.25

gauss_b = Gauss(x_range, mu_b, sigma_b, intensity_b) + Gauss(x_range, mu_b1, sigma_b1, intensity_b1) + Gauss(x_range, mu_b2, sigma_b2, intensity_b2) + Gauss(x_range, mu_b3, sigma_b3, intensity_b3)

# Component C
mu_c1 = 701
sigma_c1 = 10
intensity_c1 = 5

mu_c2 = 2400
sigma_c2 = 40
intensity_c2 = 6

gauss_c = Gauss(x_range, mu_c1, sigma_c1, intensity_c1) + Gauss(x_range, mu_c2, sigma_c2, intensity_c2)

# Component normalization
component_a = gauss_a/np.max(gauss_a)
component_b = gauss_b/np.max(gauss_b)
component_c = gauss_c/np.max(gauss_c)

# How do they look?
# plt.plot(x_range, component_a, label = 'Component 1')
# plt.plot(x_range, component_b, label = 'Component 2')
# plt.plot(x_range, component_c, label = 'Component 3')
# plt.title('Known components in our mixture', fontsize = 15)
# plt.xlabel('Wavelength', fontsize = 15)
# plt.ylabel('Normalized intensity', fontsize = 15)
# plt.legend()
# plt.show()

c_a = 0.5
c_b = 0.3
c_c = 0.2

comps = np.array([c_a, c_b, c_c])

# Let's build the spectrum to be studied: The mixture spectrum
mix_spectrum = c_a * component_a + c_b * component_b + c_c *component_c

# How does it look?
# plt.plot(x_range, mix_spectrum, color = 'black', label = 'Mixture spectrum with noise')
# plt.title('Mixture spectrum', fontsize = 15)
# plt.xlabel('Wavelength', fontsize = 15)
# plt.ylabel('Intensity',  fontsize = 15)
# plt.show()

# Let's add some noise for a bit of realism:

# Random noise:
mix_spectrum = mix_spectrum +  np.random.normal(0, 0.01, len(x_range))

# Spikes: 
# mix_spectrum[800] = mix_spectrum[800] + 1
# mix_spectrum[300] = mix_spectrum[300] + 0.3

# Baseline as a polynomial background:
poly = 0.1 * np.ones(len(x_range)) + 0.00003 * x_range + 0.000000051 * (x_range - 2500)**2 
mix_spectrum = mix_spectrum + poly

# How does it look now?
# plt.plot(x_range, mix_spectrum, color = 'black', label = 'Mixture spectrum with noise')
# plt.title('Mixture spectrum', fontsize = 15)
# plt.xlabel('Wavelength', fontsize = 15)
# plt.ylabel('Intensity',  fontsize = 15)
# plt.show()

# for i,e in enumerate(mix_spectrum):
    # print(x_range[i],e)

# Baseline stimation function:
def baseline_als(y, lam, p, niter=100):
    L = len(y)
    D = sparse.diags([1,-2,1],[0,-1,-2], shape=(L,L-2))
    w = np.ones(L)
    for i in range(niter):
        W = sparse.spdiags(w, 0, L, L)
        Z = W + lam * D.dot(D.transpose())
        z = spsolve(Z, w*y)
        w = p * (y > z) + (1-p) * (y < z)
    return z

estimated_baselined = baseline_als(mix_spectrum, 1e7, 0.05)

# Baseline subtraction:
baselined_spectrum = mix_spectrum - estimated_baselined

# How does it look like?
fig, (ax1, ax2) = plt.subplots(1,2, figsize=(16,4))

# We compared the original mix spectrum and the estimated baseline:
ax1.plot(x_range, mix_spectrum, color = 'black', label = 'Mix spectrum with noise' )
ax1.plot(x_range, estimated_baselined, color = 'red', label = 'Estimated baseline')
ax1.set_title('Baseline estimation', fontsize = 15)
ax1.set_xlabel('Wavelength', fontsize = 15)
ax1.set_ylabel('Intensity',  fontsize = 15)
ax1.legend()

# We plot the mix spectrum after baseline subtraction
ax2.plot(x_range, baselined_spectrum, color = 'black', label = 'Baselined spectrum with noise' )
ax2.set_title('Baselined spectrum', fontsize = 15)
ax2.set_xlabel('Wavelength', fontsize = 15)
ax2.set_ylabel('Intensity',  fontsize = 15)
plt.show()
